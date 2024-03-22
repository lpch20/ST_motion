import * as express from 'express';
import request from 'request';
import { DebtData } from '../../../datatypes/DebtData';
import { ResultCode, ResultError, ResultWithData } from '../../../datatypes/result';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { DebtModel } from '../models/CustomerDebtModel';
import { CustomerModel } from '../models/customerModel';
import { Entity, ImportModel } from '../models/importModel';
import { QueueModel } from '../models/queueModel';
import { IQueryableConnection, MainController } from './mainController';
var fs = require('fs');
const http = require('http');


export class ImportCustomerDebtController extends MainController {
    private resource: string;
    private debtDataModel: DebtModel;
    private customerModel: CustomerModel;
    private queueModel: QueueModel;
    private importModel: ImportModel;

    configPath: string = 'server/config/assign.json';

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.debtDataModel = new DebtModel();
        this.customerModel = new CustomerModel(controllerConnections);
        this.queueModel = new QueueModel();
        this.importModel = new ImportModel();

        var currentPath = process.cwd();
        console.log(currentPath);
    }

    public debtData = (httpReq: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(httpReq, httpRes, this.resource, (dbName: string) => {
            this.getConnection(dbName, httpRes, (conn: IQueryableConnection) => {
                this.importModel.beginImport(Entity.Debt, conn, (beginImportErr, beginImportRes) => {
                    const import_id = beginImportRes.insertId;
                    const mora = this.getMoraType(dbName);
                    const importDebtUrl = `http://localhost:5004/api/importer/deuda/${mora}`;

                    request(importDebtUrl, (error, response, body) => {
                        if (error) {
                            // Print the error if one occurred
                            console.error(new Date(), error);
                            this.importModel.endErrorImport(import_id, error, conn, (endError: any, endErrorRes: any) => {
                                if (!endError) {
                                    httpRes.send(beginImportErr);
                                } else {
                                    httpRes.send(endError);
                                }
                                httpRes.send({
                                    result: ResultCode.Error,
                                    message: 'Error al obtener deuda.',
                                    data: error
                                });
                            });
                        } else if (response && response.statusCode === 200 && body) {
                            let debtDataResponse: ResultWithData<any> = JSON.parse(body);
                            if (debtDataResponse && debtDataResponse.result === ResultCode.OK) {
                                if (!beginImportErr) {
                                    let debtData = JSON.parse(debtDataResponse.data);
                                    const CURRENT_CUSTOMER_INDEX = 0;
                                    this.importCustomerDebtsRecursive(debtData, CURRENT_CUSTOMER_INDEX, conn, (resultDebt) => {
                                        if (resultDebt.result == ResultCode.OK) {
                                            this.importModel.endSuccessImport(import_id, '', conn, (endSuccessImportErr, endSuccessImportRes) => {
                                                if (!endSuccessImportErr) {
                                                    httpRes.send({
                                                        result: ResultCode.OK,
                                                        message: 'Importacion de deuda correcta'
                                                    });
                                                } else {
                                                    httpRes.send(endSuccessImportErr);
                                                }
                                            });
                                        } else {
                                            this.importModel.endErrorImport(import_id, resultDebt, conn, (endError, endErrorRes) => {
                                                console.error(new Date(), error);
                                                if (!endError) {
                                                    httpRes.send(resultDebt);
                                                } else {
                                                    httpRes.send(endError);
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    httpRes.send(beginImportErr);
                                }
                            } else {
                                httpRes.send({
                                    result: ResultCode.Error,
                                    message: "Error al obtener datos de deuda.",
                                    data: debtDataResponse
                                });
                            }
                        } else {
                            // not errror, but unexpected statusCode
                            console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received

                            httpRes.send({
                                result: ResultCode.Error,
                                message: 'Error al obtener datos de deuda.',
                                data: `Recibido status code erroneo ${response.statusCode}.`
                            });
                        }
                    });
                });
            });
        });
    }

    private importCustomerDebtsRecursive(allDebData: DebtData[], indexData: number, connection: IQueryableConnection, callBack: (r: ResultWithData<any>) => void): void {
        if (indexData < allDebData.length) {
            let dataDebt: DebtData = allDebData[indexData];
            //console.log(dataDebt);
            this.debtDataModel.getCustomerDebtDataByCI(dataDebt.ci, connection, (responseDebtData) => {
                if (responseDebtData.result == ResultCode.OK) {
                    if (responseDebtData.data) {
                        // set id
                        dataDebt.idCustomer = responseDebtData.data.idCustomer;
                        // set default values
                        dataDebt.haveAmnesty = dataDebt.haveAmnesty ? dataDebt.haveAmnesty : responseDebtData.data.haveAmnesty;
                        dataDebt.amountOrderDollar = dataDebt.amountOrderDollar ? dataDebt.amountOrderDollar : responseDebtData.data.amountOrderDollar;
                        dataDebt.amountAmnestyDollar = dataDebt.amountAmnestyDollar ? dataDebt.amountAmnestyDollar : responseDebtData.data.amountAmnestyDollar;

                        // update
                        this.debtDataModel.updataCustomerDebtData(dataDebt, connection, (resultCustomerDebtUpdate) => {
                            if (resultCustomerDebtUpdate.result == ResultCode.OK) {
                                this.importCustomerDebtsRecursive(allDebData, indexData + 1, connection, callBack);
                            } else {
                                callBack(resultCustomerDebtUpdate);
                            }
                        });
                    } else { // no existe el registro de customer debt
                        // obtiene el customer para chequear que existe y extraer el idCustomer para asignarlo a la row de la deuda
                        this.customerModel.getCustomerIdByCI(dataDebt.ci, connection, (responseCustomerId) => {
                            if (responseCustomerId.result == ResultCode.OK) {
                                if (responseCustomerId.data) {
                                    // set id 
                                    dataDebt.idCustomer = responseCustomerId.data;
                                    // set default values
                                    dataDebt.haveAmnesty = dataDebt.haveAmnesty ? dataDebt.haveAmnesty : false;
                                    dataDebt.amountOrderDollar = dataDebt.amountOrderDollar ? dataDebt.amountOrderDollar : 0;
                                    dataDebt.amountAmnestyDollar = dataDebt.amountAmnestyDollar ? dataDebt.amountAmnestyDollar : 0;
                                    // add
                                    this.debtDataModel.addCustomerDebtData(dataDebt, connection, (resultCustomerDebtAdd) => {
                                        if (resultCustomerDebtAdd.result == ResultCode.OK) {
                                            this.importCustomerDebtsRecursive(allDebData, indexData + 1, connection, callBack);
                                        } else {
                                            callBack(resultCustomerDebtAdd);
                                        }
                                    });
                                } else {
                                    callBack(<ResultError>{
                                        result: ResultCode.Error,
                                        message: `Error al importar deuda para el customer de CI '${dataDebt.ci}' que no existe`,
                                        details: responseCustomerId
                                    });
                                }
                            } else {
                                callBack(responseCustomerId);
                            }
                        });
                    }
                } else {
                    callBack(responseDebtData);
                }
            });
        } else {
            callBack({
                result: ResultCode.OK,
                message: "Procesados todas las importaciones de deuda"
            });
        }
    }

    public importCampaignsData = (httpReq: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(httpReq, httpRes, this.resource, (dbName: string) => {
            let users = new Array();
            this.getConnection(dbName, httpRes, (conn) => {
                this.importModel.beginImport(Entity.CampaignAssignment, conn, (beginImportErr, _beginImportRes) => {
                    if (!beginImportErr) {
                        const import_id = _beginImportRes.insertId;
                        const mora = this.getMoraType(dbName);
                        const importUrl = `http://localhost:5004/api/importer/asignacionCampanias/${mora}`;
                        request(importUrl, (error, response, body) => {
                            if (error) {
                                // Print the error if one occurred
                                console.error(new Date(), error);
                                this.importModel.endErrorImport(import_id, error, conn, (endError, _endErrorRes) => {
                                    httpRes.send({
                                        result: ResultCode.Error,
                                        message: 'Error al obtener los datos de asignacion de campañas.',
                                        data: error ? error : endError
                                    });
                                });
                            } else if (response && response.statusCode === 200 && body) {
                                let responseData: ResultWithData<any> = JSON.parse(body);
                                if (responseData && responseData.result === ResultCode.OK) {
                                    const campaignsData = JSON.parse(responseData.data);
                                    const importStrategy = this.getCampaignStrategy(dbName);
                                    const CURR_INDEX = 0;
                                    this.importCampaignsDataRecursive(importStrategy, users, campaignsData, CURR_INDEX, conn, (resultImportCampaignData) => {
                                        if (resultImportCampaignData.result == ResultCode.OK) {
                                            this.importModel.endSuccessImport(import_id, '', conn, (endSuccessImportErr, _endSuccessImportRes) => {
                                                if (!endSuccessImportErr) {
                                                    httpRes.send({
                                                        result: ResultCode.OK,
                                                        message: "Importacion de asignacion de campañas correcta."
                                                    });
                                                } else {
                                                    httpRes.send(endSuccessImportErr);
                                                }
                                            });
                                        } else {
                                            this.importModel.endErrorImport(import_id, resultImportCampaignData, conn, (endError, _endErrorRes) => {
                                                console.error(new Date(), error);
                                                if (!endError) {
                                                    httpRes.send(resultImportCampaignData);
                                                } else {
                                                    httpRes.send(endError);
                                                }
                                            });
                                        }
                                    });

                                } else {
                                    httpRes.send({
                                        result: ResultCode.Error,
                                        message: "Error al obtener datos de asignación de campañas.",
                                        data: error
                                    });
                                }
                            } else {
                                // not error, but unexpected statusCode
                                console.error(new Date(), response && response.statusCode);
                                httpRes.send({
                                    result: ResultCode.Error,
                                    message: 'Error al obtener datos de asignación de campañas.',
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

    private importCampaignsDataRecursive(importStrategy: ImportCampaignStrategy, users: Array<number>, allCampaignData: any[],
        currIndex: number, conn: IQueryableConnection, callBack: (r: ResultWithData<any>) => void): void {
        if (currIndex < allCampaignData.length) {
            const campaignData = allCampaignData[currIndex];
            this.customerModel.getCustomerIdByCI(campaignData.ci, conn, (customerIdResult) => {
                if (customerIdResult.result == ResultCode.OK) {
                    if (customerIdResult.data) {
                        const customerId = customerIdResult.data;
                        const idCampaign = parseInt(campaignData.campaign);
                        const user = parseInt(campaignData.idUser);

                        this.debtDataModel.getCustomerCampaignAssignments(customerId, conn, (customerCampaignResult) => {
                            if (customerCampaignResult.result == ResultCode.OK) {
                                // si existe la campaña
                                if (customerCampaignResult.data && customerCampaignResult.data.length > 0) {
                                    const lastCustomerCampaign = customerCampaignResult.data[0];
                                    if (importStrategy === ImportCampaignStrategy.OnlyAddIfNotExist) {
                                        // si existe la campaña y la estrategia es no actualizar -> se pasa al siguiente customer
                                        this.importCampaignsDataRecursive(importStrategy, users, allCampaignData, currIndex + 1, conn, callBack);
                                    } else if (importStrategy === ImportCampaignStrategy.AddOrUpdateExisting) {
                                        // si existe la campaña, es distinta a la que se importa y la estrategia es actualizar -> se agrega la campaña
                                        if (lastCustomerCampaign.idCampaign != idCampaign) {
                                            this.debtDataModel.addCustomerCampaignAssign(customerId, idCampaign, user, conn, (resultAdd) => {
                                                if (resultAdd.result == ResultCode.OK) {
                                                    this.importCampaignsDataRecursive(importStrategy, users, allCampaignData, currIndex + 1, conn, callBack);
                                                } else {
                                                    callBack(resultAdd);
                                                }
                                            });
                                        } else {
                                            // si existe la campaña y es igual a la que se importa -> se pasa al siguiente customer
                                            this.importCampaignsDataRecursive(importStrategy, users, allCampaignData, currIndex + 1, conn, callBack);
                                        }
                                    } else {
                                        callBack({
                                            result: ResultCode.Error,
                                            message: `No se reconoce estrategia de importación '${importStrategy}`
                                        });
                                    }
                                } else { // si ese customer no tiene ninguna campaña asignada
                                    const addCustomerCampaign = users.length == 0 || // no existe restriccion respecto a los usurios
                                        users.length > 0 && users.indexOf(user) >= 0;

                                    if (addCustomerCampaign) {
                                        this.debtDataModel.addCustomerCampaignAssign(customerId, idCampaign, user, conn, (resultAdd2) => {
                                            if (resultAdd2.result == ResultCode.OK) {
                                                this.queueModel.getQueueByUser(user, conn, (queueByUserResult) => {
                                                    if (queueByUserResult.result === ResultCode.OK) {
                                                        if (queueByUserResult.data && queueByUserResult.data.length > 0) {
                                                            // si no existe el customer en la cola, asignarlo
                                                            this.queueModel.existsAssignCustomerQueue(queueByUserResult.data[0].idQueue, customerId, conn, (resultExistAssign) => {
                                                                if (resultExistAssign.result === ResultCode.OK) {
                                                                    // si la asociacion queue - customer existe -> saltear el customer
                                                                    if (resultExistAssign.data) {
                                                                        this.importCampaignsDataRecursive(importStrategy, users, allCampaignData, currIndex + 1, conn, callBack);
                                                                    } else {
                                                                        // si la asociacion queue - customer NO existe -> insertar en item_queue
                                                                        this.queueModel.assignCustomerQueue(queueByUserResult.data[0].idQueue, customerId, 0, conn, (resultAssign: any) => {
                                                                            if (resultAssign.result === ResultCode.OK) {
                                                                                this.importCampaignsDataRecursive(importStrategy, users, allCampaignData, currIndex + 1, conn, callBack);
                                                                            } else {
                                                                                // error
                                                                                callBack(resultAssign);
                                                                            }
                                                                        });
                                                                    }
                                                                } else {
                                                                    // error
                                                                    callBack(resultExistAssign);
                                                                }
                                                            });
                                                        } else {
                                                            // error
                                                            callBack({
                                                                result: ResultCode.Error,
                                                                message: `Error al obtener la queue_user del user de id ${user}.`
                                                            });
                                                        }
                                                    } else {
                                                        // error
                                                        callBack(queueByUserResult);
                                                    }
                                                });
                                            } else {
                                                // error
                                                callBack(resultAdd2);
                                            }
                                        });
                                    } else {
                                        this.importCampaignsDataRecursive(importStrategy, users, allCampaignData, currIndex + 1, conn, callBack);
                                    }
                                }
                            } else {
                                // error
                                callBack({
                                    result: ResultCode.Error,
                                    message: `Error al obtener la campaña del customer de id ${customerId}.`
                                });
                            }
                        });
                    } else {
                        // warning
                        console.warn(new Date(), `Warn al obtener el customer id para la ci ${campaignData.ci}.`);
                        this.importCampaignsDataRecursive(importStrategy, users, allCampaignData, currIndex + 1, conn, callBack);
                    }
                } else {
                    // error
                    callBack(customerIdResult);
                }
            })
        } else {
            callBack({
                result: ResultCode.OK,
                message: "Importacion de la asignación de campañas correcta"
            });
        }
    }

    public importDatesAssign = (req: express.Request, res: express.Response): void => {
        let mainThis = this;
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            const mora = this.getMoraType(dbName);
            http.get(`http://localhost:5004/api/importer/asignacionFechas/${mora}`, (resp: any) => {
                let data = '';
                resp.on('data', (chunk: any) => {
                    data += chunk;
                });
                resp.on('end', () => {
                    this.getConnection(dbName, res, (con) => {
                        let dataResponse = JSON.parse(data);
                        console.log(dataResponse);
                        mainThis.importDateAssign(dataResponse.data, 0, con, function (r: any) {
                            res.send({ result: ResultCode.OK, message: "", data });
                        });
                    });
                });
            }).on("error", (err: any) => {
                console.log("Error: " + err.message);
                res.send({ result: ResultCode.Error, message: err.message });
            });
        });
    }

    private importDateAssign(allCampaignData: any[], indexData: number, connection: any, callBack: (r: ResultWithData<any>) => void): void {
        let mainThis = this;
        if (indexData < allCampaignData.length) {
            let dataDebt = allCampaignData[indexData];
            console.log(dataDebt.ci, dataDebt);
            mainThis.debtDataModel.updateCustomerAssignDate(dataDebt.idCustomer, dataDebt.date, connection, function (resultAdd: any) {
                mainThis.importDateAssign(allCampaignData, indexData + 1, connection, callBack);
            });
        } else {
            callBack({ result: ResultCode.OK, message: "" });
        }
    }

    public importAgreements = (httpReq: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(httpReq, httpRes, this.resource, (dbName: string) => {
            this.getConnection(dbName, httpRes, (conn) => {
                this.importModel.beginImport(Entity.Agreements, conn, (beginImportErr, _beginImportRes) => {
                    if (!beginImportErr) {
                        const import_id = _beginImportRes.insertId;
                        const mora = this.getMoraType(dbName);
                        const importAgreementsUrl = `http://localhost:5004/api/importer/agreements/${mora}`;
                        request(importAgreementsUrl, (error, response, body) => {
                            if (error) {
                                // Print the error if one occurred
                                console.error(new Date(), error);
                                this.importModel.endErrorImport(import_id, error, conn, (endError, _endErrorRes) => {
                                    httpRes.send({
                                        result: ResultCode.Error,
                                        message: 'Error al obtener pagos.',
                                        data: error ? error : endError
                                    });
                                });
                            } else if (response && response.statusCode === 200 && body) {
                                let responseData: ResultWithData<any> = JSON.parse(body);
                                if (responseData && responseData.result === ResultCode.OK) {
                                    const customerAgreements = JSON.parse(responseData.data);
                                    const STARTING_INDEX = 0;
                                    this.importAgreement(customerAgreements, STARTING_INDEX, conn, (resultImportAgreement) => {
                                        if (resultImportAgreement.result == ResultCode.OK) {
                                            this.importModel.endSuccessImport(import_id, '', conn, (endSuccessImportErr, _endSuccessImportRes) => {
                                                if (!endSuccessImportErr) {
                                                    httpRes.send({
                                                        result: ResultCode.OK,
                                                        message: "Importacion de convenios correcta."
                                                    });
                                                } else {
                                                    console.error(new Date(), endSuccessImportErr);
                                                    httpRes.send(endSuccessImportErr);
                                                }
                                            });
                                        } else {
                                            this.importModel.endErrorImport(import_id, resultImportAgreement, conn, (endError, _endErrorRes) => {
                                                console.error(new Date(), error);
                                                if (!endError) {
                                                    httpRes.send(resultImportAgreement);
                                                } else {
                                                    httpRes.send(endError);
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    console.error(new Date(), responseData);
                                    httpRes.send({
                                        result: ResultCode.Error,
                                        message: "Error al obtener datos de convenios.",
                                        data: error
                                    });
                                }
                            } else {
                                // not errror, but unexpected statusCode
                                console.error(new Date(), response); // Print the response status code if a response was received
                                httpRes.send({
                                    result: ResultCode.Error,
                                    message: 'Error al obtener datos de convenios.',
                                    data: `Recibido status code erroneo ${response.statusCode}.`
                                });
                            }
                        });
                    } else {
                        console.error(new Date(), beginImportErr); // Print the response status code if a response was received
                        httpRes.send(beginImportErr);
                    }
                });
            });
        });
    }

    private importAgreement(allAgreementData: any[], indexData: number, conn: any, callBack: (r: ResultWithData<any>) => void): void {
        if (indexData < allAgreementData.length) {
            const agreement = allAgreementData[indexData];
            this.customerModel.getCustomerIdByCI(agreement.ci, conn, (customerIdResult) => {
                if (customerIdResult.result === ResultCode.OK) {
                    if (customerIdResult.data) {
                        const customerId = customerIdResult.data;
                        this.debtDataModel.getCustomerAgreement(customerId, conn, (customerAgreementResult) => {
                            if (customerAgreementResult.result == ResultCode.OK) {
                                if (customerAgreementResult.data && customerAgreementResult.data.length > 0) {
                                    this.debtDataModel.updateCustomerAgreement(customerId, agreement, conn, (resultUpdate) => {
                                        if (resultUpdate.result == ResultCode.OK) {
                                            this.importAgreement(allAgreementData, indexData + 1, conn, callBack);
                                        } else {
                                            // error
                                            console.error(new Date(), customerIdResult);
                                            callBack({
                                                result: ResultCode.Error,
                                                message: `Error al actualizar el customer de id ${customerId} al importar los convenios.
                                                        Details: ${JSON.stringify(resultUpdate)}`
                                            });
                                        }
                                    });
                                } else {
                                    this.debtDataModel.addCustomerAgreement(customerId, agreement, conn, (resultAdd) => {
                                        if (resultAdd.result == ResultCode.OK) {
                                            this.importAgreement(allAgreementData, indexData + 1, conn, callBack);
                                        } else {
                                            // error
                                            console.error(new Date(), customerIdResult);
                                            callBack({
                                                result: ResultCode.Error,
                                                message: `Error al actualizar el customer de id ${customerId} al importar los convenios.
                                                        Details: ${JSON.stringify(resultAdd)}`
                                            });
                                        }
                                    });
                                }
                            } else {
                                // error
                                console.error(new Date(), customerAgreementResult);
                                callBack(customerAgreementResult);
                            }
                        });
                    } else {
                        // warn
                        console.warn(new Date(), `Warn al obtener el customer id para la ci ${agreement.ci} al importar convenios.`);
                        this.importAgreement(allAgreementData, indexData + 1, conn, callBack);
                    }
                } else {
                    console.error(new Date(), customerIdResult);
                    callBack(customerIdResult);
                }
            });
        } else {
            callBack({
                result: ResultCode.OK,
                message: "Importacion de convenios terminó correctamente"
            });
        }
    }

    private getCampaignStrategy(dbName: string): ImportCampaignStrategy {
        switch (dbName) {
            case 'requiro_test':
                return ImportCampaignStrategy.OnlyAddIfNotExist;
            case 'requiro_moratemprana':
                return ImportCampaignStrategy.AddOrUpdateExisting;
            default:
                throw new Error(`Error al obtener estrategia de importación de campañas de db ${dbName}.`);
        }
    }
}

export enum ImportCampaignStrategy {
    AddOrUpdateExisting,
    OnlyAddIfNotExist
}