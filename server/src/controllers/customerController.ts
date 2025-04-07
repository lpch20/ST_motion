import * as express from 'express';
// import csv from 'fast-csv';
// import fs from 'fs';
import request from 'request';
import { AwaitedCall } from '../../../datatypes/awaitedCall';
import { Call } from '../../../datatypes/call';
import { ClientEvent } from '../../../datatypes/clientEvent';
import { Customer } from '../../../datatypes/Customer';
import { EventType } from '../../../datatypes/LogImport';
import { Result, ResultCode, ResultWithData } from '../../../datatypes/result';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { motionMail } from '../../motionLibJS/motionMail/motionMail';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { CallModel } from '../models/callModel';
import { CustomerModel } from '../models/customerModel';
import { EventModel } from '../models/eventModel';
import { Entity, ImportModel } from '../models/importModel';
import { ParameterModel } from '../models/parameters';
import { QueueModel } from '../models/queueModel';
import { UserModel } from '../models/userModel';
import { IConnection, IPromiseConnection, MainController } from './mainController';
import moment = require('moment');
const http = require('http');

export class CustomerController extends MainController {

    private resource: string;
    private customerModel: CustomerModel;
    private userModel: UserModel;
    private queueModel: QueueModel;
    private callModel: CallModel;
    private eventModel: EventModel;
    private importModel: ImportModel;
    private countDept: number = 0;
    private countDeptD: number = 0;
    private parameterModel: ParameterModel;
    private connection: any;
    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.customerModel = new CustomerModel(controllerConnections);
        this.userModel = new UserModel(controllerConnections);
        this.queueModel = new QueueModel();
        this.callModel = new CallModel(controllerConnections);
        this.eventModel = new EventModel();
        this.importModel = new ImportModel();
        this.parameterModel = new ParameterModel(controllerConnections);

    }

    public allCustomers = (req: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(req, httpRes, this.resource, (dbName: string) => {
            this.getConnection(dbName, httpRes, (conn: any) => {
                this.importModel.beginImport(Entity.AllCustomer, conn, (beginImportErr, _beginImportRes) => {
                    if (!beginImportErr) {
                        const import_id = _beginImportRes.insertId;
                        const mora = this.getMoraType(dbName);
                        const importUrl = `http://localhost:5004/api/importer/allCustomerData/${mora}`;
                        request(importUrl, (error, response, body) => {
                            if (error) {
                                // Print the error if one occurred
                                console.error(new Date(), error);
                                this.importModel.endErrorImport(import_id, error, conn, (endError, _endErrorRes) => {
                                    httpRes.send({
                                        result: ResultCode.Error,
                                        message: 'Error al obtener todos los customers.',
                                        data: error ? error : endError
                                    });
                                });
                            } else if (response && response.statusCode === 200 && body) {
                                let responseData: ResultWithData<any> = JSON.parse(body);
                                if (responseData && responseData.result === ResultCode.OK) {
                                    const allCustomers = JSON.parse(responseData.data);
                                    const CURRENT_CUSTOMER_INDEX = 0;
                                    this.addCustomersRecursive(allCustomers, CURRENT_CUSTOMER_INDEX, import_id, conn, (resultImportCustomer) => {
                                        if (resultImportCustomer.result == ResultCode.OK) {
                                            this.importModel.endSuccessImport(import_id, '', conn, (endSuccessImportErr, _endSuccessImportRes) => {
                                                if (!endSuccessImportErr) {
                                                    httpRes.send({
                                                        result: ResultCode.OK,
                                                        message: 'Importacion de todos los customers correcta'
                                                    });
                                                } else {
                                                    httpRes.send(endSuccessImportErr);
                                                }
                                            });
                                        } else {
                                            this.importModel.endErrorImport(import_id, resultImportCustomer, conn, (endError, _endErrorRes) => {
                                                if (!endError) {
                                                    httpRes.send(resultImportCustomer);
                                                } else {
                                                    httpRes.send(endError);
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    httpRes.send({
                                        result: ResultCode.Error,
                                        message: "Error al obtener todos los customers.",
                                        data: responseData
                                    });
                                }
                            } else {
                                // not error, but unexpected statusCode
                                console.error(new Date(), response && response.statusCode);
                                httpRes.send({
                                    result: ResultCode.Error,
                                    message: 'Error al obtener todos los customers.',
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

    public addCustomers = (req: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(req, httpRes, this.resource, (dbName: string) => {
            this.getConnection(dbName, httpRes, (con: any) => {
                const mora = this.getMoraType(dbName);
                http.get(`http://localhost:5004/api/importer/customerData/${mora}`, (resp: any) => {
                    let customerDataResponse = '';
                    // A chunk of data has been recieved.
                    resp.on('data', (chunk: any) => {
                        customerDataResponse += chunk;
                    });

                    // The whole response has been received. Print out the result.
                    resp.on('end', () => {
                        this.importModel.beginImport(Entity.Customer, con, (beginImportErr, beginImportRes) => {
                            if (!beginImportErr) {
                                const import_id = beginImportRes.insertId;
                                const customerData: ResultWithData<any> = JSON.parse(customerDataResponse);
                                if (customerData.result == ResultCode.OK) {
                                    const CURRENT_CUSTOMER_INDEX = 0;
                                    const customers = JSON.parse(customerData.data);
                                    this.addCustomersRecursive(customers, CURRENT_CUSTOMER_INDEX, import_id, con, (resultImportCustomer) => {
                                        if (resultImportCustomer.result == ResultCode.OK) {
                                            this.customerModel.getNumberOfCustomersWithLastImportId(import_id, con, (customersUpdated) => {
                                                const percentageProccesed = (customersUpdated.data! / customers.length) * 100;
                                                const information = 'percentage processed = ' + percentageProccesed + '%';
                                                if (customersUpdated.result === ResultCode.OK && (percentageProccesed > 80)) {
                                                    this.customerModel.disableCustomersForOlderLastImport(import_id, con, (response) => {
                                                        // TODO: - ver si se maneja el error o se ignora
                                                        this.importModel.endSuccessImport(import_id, information, con, (endSuccessImportErr, endSuccessImportRes) => {
                                                            if (!endSuccessImportErr) {
                                                                httpRes.send({
                                                                    result: ResultCode.OK,
                                                                    message: 'Importacion de customers correcta'
                                                                });
                                                            } else {
                                                                httpRes.send(endSuccessImportErr);
                                                            }
                                                        });
                                                    });
                                                } else {
                                                    this.importModel.endSuccessImport(import_id, information, con, (endSuccessImportErr, endSuccessImportRes) => {
                                                        if (!endSuccessImportErr) {
                                                            httpRes.send({
                                                                result: ResultCode.OK,
                                                                message: 'Importacion de customers correcta'
                                                            });
                                                        } else {
                                                            httpRes.send(endSuccessImportErr);
                                                        }
                                                    });
                                                }
                                            });

                                        } else {
                                            this.importModel.endErrorImport(import_id, resultImportCustomer, con, (endError, endErrorRes) => {
                                                if (!endError) {
                                                    httpRes.send(resultImportCustomer);
                                                } else {
                                                    httpRes.send(endError);
                                                }
                                            });
                                        }
                                    });
                                } else {
                                    this.importModel.endErrorImport(import_id, customerData, con, (endError, endErrorRes) => {
                                        if (!endError) {
                                            httpRes.send(customerData);
                                        } else {
                                            httpRes.send(endError);
                                        }
                                    });
                                }
                            } else {
                                httpRes.send(beginImportErr);
                            }
                        });
                    });
                }).on("error", (err: any) => {
                    console.log("Error: " + err.message);
                    httpRes.send({
                        result: ResultCode.Error,
                        message: err.message
                    });
                });
            });
        });
    };

    public changeCampaign = (req: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(req, httpRes, this.resource, async (dbName: string) => {
            let conn: IPromiseConnection;
            try {
                conn = await this.getConnectionWithPromise(dbName);
                const idUser: number = 1;
                let countOK = 0;
                let countError = 0;

                const idLog = await this.customerModel.logMassiveUpdateStart(idUser, "Change_Campaign", countOK, countError, conn);
                const fileRows: any[] = [];

                //     // open uploaded file
                // csv.fromPath(req.file.path)
                //     .on("data", function (data) {
                //         fileRows.push({ "ci": data[0], "idCampaign": data[1] }); // push each row
                //     })
                //     .on("end", async () => {
                //         console.log(fileRows)
                //         const totalRows = fileRows.length;

                //         for (let i = 1; i < totalRows; i++) {
                //             const customerId = await this.customerModel.getCustomerIdByCIPromise(fileRows[i].ci, conn);
                //             await conn.query('START TRANSACTION');
                //             await this.customerModel.cleanCustomerCampaignByCustomer(customerId, conn);

                //             try {
                //                 await this.customerModel.assignCustomerCampaign(customerId, fileRows[i].idCampaign, idUser, conn);
                //                 await conn.query("COMMIT");
                //                 countOK++;
                //             } catch (err) {
                //                 console.error(`Error al asignar el cliente ${fileRows[i].ci}, id ${customerId}`);
                //                 await conn.query('ROLLBACK');
                //                 countError++;
                //             }

                //         }

                //         await this.customerModel.logMassiveUpdateEnd(idLog, countOK, countError, conn);
                //         fs.unlinkSync(req.file.path);   // remove temp file
                //         //process "fileRows" and respond
                //         const logData = await this.customerModel.logMassiveData(idLog, conn);
                //         httpRes.send({ message: "Termino la importacion", data: logData });
                //     });
            } catch (err) {
                console.error(err);
            }
        });
    }

    public changeQueue = (req: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(req, httpRes, this.resource, async (dbName: string) => {
            let conn: IPromiseConnection;
            try {
                conn = await this.getConnectionWithPromise(dbName);
                const idUser: number = 1;
                let countOK = 0;
                let countError = 0;

                const idLog = await this.customerModel.logMassiveUpdateStart(idUser, "Cahnge_Queue", countOK, countError, conn);
                const fileRows: any[] = [];

                //     // open uploaded file
                // csv.fromPath(req.file.path)
                //     .on("data", function (data) {
                //         fileRows.push({ "ci": data[0], "idQueue": data[1] }); // push each row
                //     })
                //     .on("end", async () => {
                //         console.log(fileRows)
                //         const totalRows = fileRows.length;

                //         for (let i = 1; i < totalRows; i++) {
                //             const customerId = await this.customerModel.getCustomerIdByCIPromise(fileRows[i].ci, conn);
                //             await conn.query('START TRANSACTION');
                //             try {
                //                 await this.customerModel.updateCustomerQueue(fileRows[i].idQueue, customerId, conn);
                //                 await conn.query("COMMIT");
                //                 countOK++;
                //             } catch (err) {
                //                 console.error(`Error al cambiar de cola el cliente ${fileRows[i].ci}, id ${customerId}`);
                //                 await conn.query('ROLLBACK');
                //                 countError++;
                //             }
                //         }

                //         await this.customerModel.logMassiveUpdateEnd(idLog, countOK, countError, conn);
                //         fs.unlinkSync(req.file.path);   // remove temp file
                //         //process "fileRows" and respond
                //         httpRes.send({ message: "Termino la importacion" });
                //     });
            } catch (err) {
                console.error(err);
            }
        });
    }



    public sendImportSummary = (httpReq: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(httpReq, httpRes, this.resource, (dbName: string) => {
            this.getConnection(dbName, httpRes, (conn: any) => {
                const mora = this.getMoraType(dbName);

                this.importModel.getLastBatchImportResult(conn, result => {

                    const currDate = moment(new Date()).format('DD/MM/YYYY');
                    const isDbRequestSuccess = result.result == ResultCode.OK && result.data && result.data.length > 0;
                    const isImportSuccess = isDbRequestSuccess && result.data ? !result.data.filter(i => i.event == EventType.end).some(i => !i.isSuccess) : false;
                    const isSuccess = isDbRequestSuccess && isImportSuccess;

                    const subject = `Requiro - Importacion ${currDate} ${isSuccess ? 'correcta' : 'con ERROR'} ( ${mora} )`;
                    const mailTo = 'news-it@dlab.com.uy';

                    let text = `<tr><th><b>id</b></th><th><b>entity</b></th><th><b>startDate</b></th><th><b>endDate</b></th><th><b>success</b></th><th><b>information</b></th><th><b>error message</b></th></tr>`;
                    if (isDbRequestSuccess) {
                        result.data!.forEach(m => {
                            text = text + `<tr><td>${m.id}</td><td>${m.entity}</td><td>${moment(m.startDate).format('DD/MM/YYYY HH:mm:ss')}</td><td>${moment(m.endDate).format('DD/MM/YYYY HH:mm:ss')}</td><td>${m.isSuccess == null ? '-' : m.isSuccess}</td><td>${m.information == null ? '' : m.information}</td><td>${m.errorMessage == null ? '' : m.errorMessage}</td></tr>`;
                        });
                    }

                    const isHtml = true;
                    motionMail.sendMail(subject, `<html><body><table>${text}</table></body></html>`, isHtml, mailTo, null,
                        (r: string) => {
                            console.log(r)
                            httpRes.send(r);
                        },
                        (e: string) => {
                            console.error(e);
                            httpRes.send(e);
                        });
                });
            });
        });
    }

    private addCustomersRecursive(data: Customer[], indexCustomer: number, importId: number, con: IConnection, callBack: (r: Result) => void): void {
        if (indexCustomer < data.length) {
            this.customerModel.existCustomer(data[indexCustomer].ci, con, resultQuery => {
                if (resultQuery.result == ResultCode.OK) {
                    var customerReceived = data[indexCustomer];
                    customerReceived.lastImportId = importId;
                    // si ya existe el customer
                    if (resultQuery.data) {
                        this.customerModel.updateLastImportId(customerReceived, con, (updateCustomerResponse) => {
                            this.addCustomersRecursive(data, indexCustomer + 1, importId, con, callBack);
                        });
                    } else {
                        this.customerModel.addCustomer(customerReceived, con, (addCustomerResponse) => {
                            if (addCustomerResponse.result === ResultCode.OK) {
                                this.addPhonesCustomer(addCustomerResponse.data, data[indexCustomer].phones, 0, con, (addPhonesCustomerResponse) => {
                                    if (addPhonesCustomerResponse.result === ResultCode.OK) {
                                        this.addCustomersRecursive(data, indexCustomer + 1, importId, con, callBack);
                                    } else {
                                        callBack(addPhonesCustomerResponse);
                                    }
                                });
                            } else {
                                callBack(addCustomerResponse);
                            }
                        });
                    }
                } else {
                    callBack(resultQuery);
                }
            });
        } else {
            callBack({
                result: ResultCode.OK,
                message: "Importación de customers terminó correctamente"
            });
        }
    }

    private addPhonesCustomer(customerId: number, phones: string[], indexPhone: number, con: any, callBack: (r: any) => void): void {
        if (indexPhone < phones.length) {
            this.customerModel.addPhoneCustomer(customerId, phones[indexPhone], con, (resultAddPhone: any) => {
                this.addPhonesCustomer(customerId, phones, indexPhone + 1, con, callBack);
            })
        } else {
            callBack({ result: ResultCode.OK, message: "" });
        }
    }

    public getAll = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.customerModel.getAll(dbName, (result: any) => {
                res.send(result);
            });
        });
    };

    public getDeactiveCustomers = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                this.customerModel.getDeactivateCustomers(con, (result: any) => {
                    res.send(result);
                });
            });
        });
    };

    public getCustomersNotAssignedQueue = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                this.customerModel.getCustomersNotAssignedQueue(con, (result: any) => {
                    res.send(result);
                });
            });
        });
    };

    public getCustomerById = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.customerModel.getCustomerById(req.params.id, dbName, (result: any) => {
                res.send(result);
            });
        });
    };

    public getPhonesByCustomersById = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.customerModel.getPhonesByCustomersById(req.params.id, dbName, (result: any) => {
                res.send(result);
            });
        });
    };

    public findCustomer = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (response: any) => {
                    if (response.result == ResultCode.OK) {
                        var idUser = response.data[0].id;
                        this.queueModel.getQueueByUser(idUser, con, (r: any) => {
                            if (r.data.length > 0) {
                                let idQueue = r.data[0].idQueue;
                                this.customerModel.findCustomer(req.body.name, req.body.lastname, req.body.ci, req.body.phone, idQueue, con, (result: any) => {
                                    res.send(result);
                                });
                            } else {
                                this.customerModel.findAllCustomer(req.body.name, req.body.lastname, req.body.ci, req.body.phone, con, (result: any) => {
                                    res.send(result);
                                });
                            }

                        });
                    }
                });
            });
        });
    };

    public findAllCustomer = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                this.customerModel.findAllCustomer(req.body.name, req.body.lastname, req.body.ci, req.body.phone, con, (result: any) => {
                    res.send(result);
                });
            });
        });
    };

    public filterCustomers = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.customerModel.filterCustomers(req.body.filters, req.body.negatedFilters, req.body.joins, dbName, (result: any) => {
                res.send(result);
            });
        });
    };

    public getNext = (req: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(req, httpRes, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (response: any) => {
                    if (response.result == ResultCode.OK) {
                        var idUser = response.data[0].id;
                        this.userModel.queueByUser(idUser, con, (queueRes: any) => {
                            if (queueRes.result > 0 && queueRes.data && queueRes.data.length > 0) {
                                const idQueue = queueRes.data[0].idQueue;
                                this.customerModel.getNext(idQueue, idUser, con, (nextCustomersRes) => {
                                    if (nextCustomersRes.result === ResultCode.OK) {
                                        if (nextCustomersRes.data && nextCustomersRes.data.length > 0) {
                                            const idCustomer = nextCustomersRes.data[0].id;
                                            this.customerModel.assignItemQueueUserToCustomer(idQueue, idUser, idCustomer, con, assignResult => {
                                                if (assignResult.result === ResultCode.OK) {
                                                    httpRes.send(nextCustomersRes);
                                                } else {
                                                    httpRes.send(assignResult)
                                                }
                                            });
                                        } else {
                                            httpRes.send(nextCustomersRes);
                                        }
                                    } else {
                                        httpRes.send({
                                            nextCustomersRes: ResultCode.Error,
                                            message: `Error al obtener los siguientes clientes para la cola '${idQueue}'`
                                        });
                                    }
                                });
                            } else {
                                httpRes.send({
                                    result: ResultCode.Error,
                                    message: "El agente no tiene una cola asignada"
                                });
                            }
                        });
                    } else {
                        httpRes.send({
                            result: ResultCode.Error,
                            message: 'Usuario no existe o no esta logeado'
                        });
                    }
                });
            });
        });
    };

    public update = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getConnection(dbName, res, (con: any) => {
                con.beginTransaction((err: any) => {
                    if (err) {
                        con.rollback(() => {
                            res.send({ result: ResultCode.Error, message: "Error al crear la transaccion" });
                        });
                    } else {
                        let customer: Customer = req.body.customer;
                        this.customerModel.update(customer, con, (result: any) => {
                            this.deleteDuplicatePhonesCustomer(customer.id, customer.phones, 0, con, (resultDeleteDuplicates: any) => {
                                this.customerModel.deactivatePhonesCustomer(customer.id, con, (result: any) => {
                                    this.customerModel.activatePhonesCustomer(customer.id, customer.phones, con, (r: any) => {
                                        this.customerModel.getPhonesInCustomer(customer.id, customer.phones, con, (result: any) => {
                                            if (result.data && result.data.length < customer.phones.length) {
                                                let phoneResults: string[] = [];
                                                for (let i = 0; i < result.data.length; i++) {
                                                    phoneResults.push(result.data[i].phone);
                                                }
                                                let newPhones = customer.phones.filter((phone) => {
                                                    return phoneResults.indexOf(phone) === -1;
                                                });
                                                this.addPhonesCustomer(customer.id, newPhones, 0, con, (resultAddPhones: any) => {
                                                    this.updatePhonePosition(customer.id, customer.phones, 0, con, (r: any) => {
                                                        con.commit((err: any) => {
                                                            if (err) {
                                                                res.send({ result: ResultCode.Error, message: "Error al enviar la transaccion" });
                                                            }
                                                            res.send(result);
                                                        });
                                                    });
                                                });
                                            } else {
                                                this.updatePhonePosition(customer.id, customer.phones, 0, con, (r: any) => {
                                                    con.commit((err: any) => {
                                                        if (err) {
                                                            res.send({ result: ResultCode.Error, message: "Error al enviar la transaccion" });
                                                        }
                                                        res.send(result);
                                                    });
                                                });
                                            }
                                        });
                                    });
                                });
                            });
                        });
                    }
                });
            });
        });
    };

    private deleteDuplicatePhonesCustomer(customerId: number, phones: string[], indexPhone: number, con: any, callBack: (r: any) => void): void {
        if (indexPhone < phones.length) {
            this.customerModel.deleteDuplicatePhoneCustomer(customerId, phones[indexPhone], con, (result: any) => {
                this.deleteDuplicatePhonesCustomer(customerId, phones, indexPhone + 1, con, callBack);
            });
        } else {
            callBack({ result: ResultCode.OK, message: "" });
        }
    }


    private updatePhonePosition(customerId: number, phones: string[], indexPhone: number, con: any, callBack: (r: any) => void): void {
        if (indexPhone < phones.length) {
            this.customerModel.updatePhonePosition(customerId, phones[indexPhone], indexPhone, con, (result: any) => {
                this.updatePhonePosition(customerId, phones, indexPhone + 1, con, callBack);
            });
        } else {
            callBack({ result: ResultCode.OK, message: "" });
        }
    }

    public addEvent = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, con => {
                let user = <string>req.headers['user'];
                this.userModel.getUserByUsername(user, con, (result: any) => {
                    let event: ClientEvent = req.body.customerEvent.event;
                    const eventRedirection: string = req.body.customerEvent.eventRedirection;
                    let idUser: number = result.data[0].id;
                    let extension = event.ext;

                    if (req.body.customerEvent.flag !== 'undefined' && !req.body.customerEvent.flag) {
                        this.connection = this.masterDBController.getMasterConnection().getConnection();
                        let awaitedC: AwaitedCall = new AwaitedCall();
                        awaitedC.customerId = event.idCustomer.toString();
                        awaitedC.destination = event.phone;
                        awaitedC.source = extension;

                        this.parameterModel.addCallAwaited(awaitedC, this.connection, (result: any) => {

                        });
                    }


                    this.callModel.getLastCall(idUser, extension, con, (lastCall: ResultWithData<Call>) => {
                        const withoutPhone: boolean = result.data[0].withoutPhone;
                        const idCampaign = req.body.customerEvent.idCampaign;
                        if (withoutPhone) {
                            this.customerModel.addEvent(eventRedirection, idCampaign, event, user, withoutPhone, con, (result) => {
                                res.send(result);
                            });
                        } else {
                            // se valida que se haya hecho una llamada a ese customer en los ultimos 20 minutos
                            if (!!lastCall && lastCall.data && lastCall.data.idCustomer == event.idCustomer) {
                                this.customerModel.addEvent(eventRedirection, idCampaign, event, user, withoutPhone, con, (result) => {
                                    this.customerModel.customerLastInteraction(event.idCustomer, con, (resultCustomerUpdate) => {
                                        // si coincide el telefono es el mejor caso 
                                        if (lastCall && lastCall.data && lastCall.data.tel == event.phone) {
                                            res.send(result);
                                        } else { // es el mismo customer pero no coincide el telefono
                                            const errorMessage = 'Atención al guardar el evento.' +
                                                `No existe una llamada a ${event.phone} del customer ${event.idCustomer},` +
                                                `pero si existe a ${lastCall && lastCall.data ? lastCall.data.tel : 'FATAL:phone is undefined'}.`;
                                            this.eventModel.insertCustomerEventError(idUser, event, errorMessage, con, () => {
                                                res.send(result);
                                            });
                                        }
                                    });
                                });
                            }
                        }

                        // else {
                        //     const logMessage = `Error al guardar el evento. No existe ninguna llamada el customer ${event.idCustomer}.`;
                        //     this.eventModel.insertCustomerEventError(idUser, event, logMessage, con, (result: any) => {
                        //         const friendlyMessage = 'Error al guardar el evento. No existe la llamada correspondiente';
                        //         res.send({
                        //             result: ResultCode.Error,
                        //             message: friendlyMessage
                        //         });
                        //     });
                        // }
                    });
                });
            })
        });
    };

    public updateItemQueueStatus = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.customerModel.updateItemQueueStatus(req.body.idCustomer, req.body.status, con, (result: any) => {
                    res.send(result);
                });
            });
        });
    };

    public setItemQueueFinish = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getConnection(dbName, res, con => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (response: any) => {
                    if (response.result > 0) {
                        var idUser = response.data[0].id;
                        if (req.headers['user'] !== "supervisor_test") {

                            console.log("se llamará al SetItemQueueFinish con el user: " + idUser + " y el customer " + req.body.idCustomer);
                            this.customerModel.setItemQueueFinish(idUser, req.body.idCustomer, con, (result: any) => {
                                res.send(result);
                            });
                        } else {
                            res.send({
                                result: ResultCode.OK,
                                message: 'El usuario es un supervisor',
                                data: []
                            });
                        }
                    } else {
                        res.send({
                            result: ResultCode.Error,
                            message: 'Usuario no existe o no esta logeado'
                        });
                    }
                });
            });
        });
    };

    public customerDebt = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                this.customerModel.customerDebt(req.params.idCustomer, con, (result: any) => {
                    res.send(result);
                });
            });
        });
    };

    public customerPayments = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                this.customerModel.customerPayments(req.params.idCustomer, con, (result: any) => {
                    res.send(result);
                });
            });
        });
    };

    public getCustomersCampaign = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (conn: any) => {
                const idCustomers: number[] = req.body;
                this.customerModel.getCustomersCampaign(idCustomers, conn, (result: any) => {
                    res.send(result);
                });
            });
        });
    }

    public customerAgreement = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                this.customerModel.customerAgreement(req.params.idCustomer, con, (result: any) => {
                    res.send(result);
                });
            });
        });
    };

    public getCareers = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                this.customerModel.getCareers(con, (result: any) => {
                    res.send(result);
                });
            });
        });
    };
}
