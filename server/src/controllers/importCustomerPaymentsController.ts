import * as express from 'express';
import request from 'request';
import { CustomerPayment } from '../../../datatypes/CustomerPayment';
import { ResultCode, ResultWithData } from '../../../datatypes/result';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { CustomerModel } from '../models/customerModel';
import { Entity, ImportModel } from '../models/importModel';
import { PaymentsModel } from '../models/paymentsModel';
import { IQueryableConnection, MainController } from './mainController';

export class ImportCustomerPaymentsController extends MainController {
    private resource: string;
    private paymentsModel: PaymentsModel;
    private customerModel: CustomerModel;
    private importModel: ImportModel;

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.paymentsModel = new PaymentsModel();
        this.customerModel = new CustomerModel(controllerConnections);
        this.importModel = new ImportModel();
    }

    public paymentData = (req: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(req, httpRes, this.resource, (dbName: string) => {
            this.getConnection(dbName, httpRes, (con) => {
                this.importModel.beginImport(Entity.Payment, con, (beginImportErr, _beginImportRes) => {
                    if (!beginImportErr) {
                        const import_id = _beginImportRes.insertId;
                        const mora = this.getMoraType(dbName);
                        const importUrl = `http://localhost:5004/api/importer/pagos/${mora}`;
                        request(importUrl, (error, response, body) => {
                            if (error) {
                                // Print the error if one occurred
                                console.error(new Date(), error);
                                this.importModel.endErrorImport(import_id, error, con, (endError, _endErrorRes) => {
                                    httpRes.send({
                                        result: ResultCode.Error,
                                        message: 'Error al obtener pagos.',
                                        data: error ? error : endError
                                    });
                                });
                            } else if (response && response.statusCode === 200 && body) {
                                let responseData: ResultWithData<any> = JSON.parse(body);
                                if (responseData && responseData.result === ResultCode.OK) {
                                    const customerPayments = JSON.parse(responseData.data);
                                    this.addPaymentsCustomerRecursive(customerPayments, 0, con, (resultImportPayment) => {
                                        if (resultImportPayment.result == ResultCode.OK) {
                                            this.importModel.endSuccessImport(import_id, '', con, (endSuccessImportErr, _endSuccessImportRes) => {
                                                if (!endSuccessImportErr) {
                                                    httpRes.send({
                                                        result: ResultCode.OK,
                                                        message: "Importacion de pagos correcta."
                                                    });
                                                } else {
                                                    httpRes.send(endSuccessImportErr);
                                                }
                                            });
                                        } else {
                                            this.importModel.endErrorImport(import_id, resultImportPayment, con, (endError, _endErrorRes) => {
                                                console.error(new Date(), error);
                                                if (!endError) {
                                                    httpRes.send(resultImportPayment);
                                                } else {
                                                    httpRes.send(endError);
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    httpRes.send({
                                        result: ResultCode.Error,
                                        message: "Error al obtener datos de pagos.",
                                        data: error
                                    });
                                }
                            } else {
                                // not error, but unexpected statusCode
                                console.error(new Date(), response && response.statusCode); // Print the response status code if a response was received
                                httpRes.send({
                                    result: ResultCode.Error,
                                    message: 'Error al obtener datos de pagos.',
                                    data: `Recibido status code erroneo ${response.statusCode}.`
                                });
                            }
                        });
                    } else {
                        httpRes.send(beginImportErr);
                    }
                });
            });
        });
    };

    private addPaymentsCustomerRecursive(customersPayment: CustomerPayment[], indexCustomerPayment: number, con: IQueryableConnection, callBack: (r: ResultWithData<any>) => void): void {
        if (indexCustomerPayment < customersPayment.length) {
            const customerCi = customersPayment[indexCustomerPayment].ci;
            if (!customerCi) {
                console.error(new Date(), `Datos de importacion incorrectos para customer: '${JSON.stringify(customersPayment[indexCustomerPayment])}'`);
            }
            this.customerModel.getCustomerIdByCI(customerCi, con, (r) => {
                if (r.result === ResultCode.OK) {
                    if (r.data) {
                        this.paymentsModel.addOrUpdatePaymentCustomer(r.data, customersPayment[indexCustomerPayment], con, (response) => {
                            if (response.result == ResultCode.OK) {
                                this.addPaymentsCustomerRecursive(customersPayment, indexCustomerPayment + 1, con, callBack);
                            } else {
                                console.error(new Date(), response);
                                callBack(response);
                            }
                        });
                    } else {
                        this.addPaymentsCustomerRecursive(customersPayment, indexCustomerPayment + 1, con, callBack);
                    }
                } else {
                    console.error(new Date(), r);
                    callBack(r);
                }
            });
        } else {
            callBack({
                result: ResultCode.OK,
                message: "Procesadas todas las importaciones de pagos"
            });
        }
    }
}
