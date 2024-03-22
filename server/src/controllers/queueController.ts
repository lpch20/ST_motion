import * as express from 'express';
import { Customer } from '../../../datatypes/Customer';
import { ResultCode } from '../../../datatypes/result';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { QueueModel } from '../models/queueModel';
import { MainController } from './mainController';

export class QueueController extends MainController {

    private resource: string;
    private queueModel: QueueModel;

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.queueModel = new QueueModel();
    }

    public getAll = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, pool => {
                this.queueModel.getAll(pool, function (result: any) {
                    res.send(result);
                });
            })
        });
    };

    public assignCustomersQueue = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, pool => {
                this.queueModel.getLastOrderCustomerQueue(req.body.idQueue, pool, (response: any) => {
                    if (response.result > 0) {
                        let lastItemPosition = response.data[0].itemOrder;
                        let customers: Customer[] = req.body.customers;
                        this.assignCustomersByQueue(req.body.idQueue, customers, lastItemPosition + 1, 0, pool, (response: any) => {
                            res.send(response);
                        })
                    } else {
                        res.send(response);
                    }
                });
            });
        });
    };

    public updateCustomersQueue = (req: express.Request, res: express.Response): void => {
        let mainThis = this;
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            var pool = mainThis.controllerConnections.getUserConnection(dbName);
            pool.getConnection(function (err: any, con: any) {
                if (!!err) {
                    res.send({ result: ResultCode.Error, message: "Error al crear la conexion" });
                } else {
                    con.beginTransaction(function (err: any) {
                        if (err) {
                            con.rollback(function () {
                                res.send({ result: ResultCode.Error, message: "Error al crear la transaccion" });
                            });
                        } else {
                            let idNewQueue = req.body.idNewQueue;
                            let idOldQueue = req.body.idOldQueue;

                            mainThis.queueModel.getLastOrderCustomerQueue(idOldQueue, con, function (response: any) {
                                if (response.result > 0 && response.data.length > 0) {
                                    let lastItemPosition = response.data[0].itemOrder;
                                    let customers: Customer[] = req.body.customers;
                                    mainThis.updateCustomersByQueue(idNewQueue, idOldQueue, customers, lastItemPosition + 1, 0, con, function (response: any) {
                                        con.commit(function (err: any) {
                                            if (err) {
                                                res.send({ result: ResultCode.Error, message: "Error al enviar la transaccion" });
                                            }
                                            con.release();
                                            res.send(response);
                                        });
                                    });
                                } else {
                                    con.release();
                                    res.send(response);
                                }
                            });
                        }
                    });
                }
            });
        });
    };


    public getCustomersByQueue = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, pool => {
                this.queueModel.getCustomersByQueue(req.params.idQueue, req.params.ci, req.params.idCampaign, pool, (response: any) => {
                    res.send(response);
                });
            });
        });
    };

    private updateCustomersByQueue(idNewQueue: number, idOldQueue: number, customers: Customer[], itemPosition: number,
        indexCustomer: number, con: any, callBack: (r: any) => void): void {
        let mainThis = this;
        if (indexCustomer < customers.length) {
            let idCustomer: number = customers[indexCustomer].id;
            this.queueModel.updateCustomerQueue(idOldQueue, idNewQueue, idCustomer, itemPosition, con,
                function (response: any) {
                    mainThis.updateCustomersByQueue(idNewQueue, idOldQueue, customers, itemPosition + 1, indexCustomer + 1, con, callBack);
                });
        } else {
            callBack({ result: ResultCode.OK });
        }
    }

    private assignCustomersByQueue(idQueue: number, customers: Customer[], itemPosition: number,
        indexCustomer: number, con: any, callBack: (r: any) => void): void {
        let mainThis = this;
        if (indexCustomer < customers.length) {
            let idCustomer: number = customers[indexCustomer].id;
            this.queueModel.assignCustomerQueue(idQueue, idCustomer, itemPosition, con,
                function (response: any) {
                    mainThis.assignCustomersByQueue(idQueue, customers, itemPosition + 1, indexCustomer + 1, con, callBack);
                    //res.send(response);
                });
        } else {
            callBack({ result: ResultCode.OK });
        }
    }

    public getUsersByQueue = async (req: express.Request): Promise<any> => {
        // se verifica el acceso
        return await super.verifyAccessWithPromise(this.getUser(req), this.getTokenId(req), this.getAccountId(req), this.resource)
            // se obtiene la conexion
            .then(dbName => this.getConnectionWithPromise(dbName))
            // se ejecuta el metodo de negocio activateDeactivate
            .then(conn => this.manage(conn, this.queueModel.getUsersByQueue(req.params.idQueue, conn)))
            // se atrapa errores y oculta informacion sensible
            .catch(err => {
                console.error(new Date(), err);
                return Promise.reject<any>('Error al activar o desactivar una campaña')
            });
    };

    public getCampaignsByQueue = async (req: express.Request): Promise<any> => {
        // se verifica el acceso
        return await super.verifyAccessWithPromise(this.getUser(req), this.getTokenId(req), this.getAccountId(req), this.resource)
            // se obtiene la conexion
            .then(dbName => this.getConnectionWithPromise(dbName))
            // se ejecuta el metodo de negocio activateDeactivate
            .then(conn => this.manage(conn, this.queueModel.getCampaignsByQueue(req.params.idQueue, conn)))
            // se atrapa errores y oculta informacion sensible
            .catch(err => {
                console.error(new Date(), err);
                return Promise.reject<any>('Error al activar o desactivar una campaña')
            });
    };

    public assignCustomerFromCampaignToQueue = async (req: express.Request): Promise<any> => {
        // se verifica el acceso
        return await super.verifyAccessWithPromise(this.getUser(req), this.getTokenId(req), this.getAccountId(req), this.resource)
            // se obtiene la conexion
            .then(dbName => this.getConnectionWithPromise(dbName))
            // se ejecuta el metodo de negocio activateDeactivate
            .then(conn => this.manage(conn, this.queueModel.assignCustomerFromCampaignToQueue(req.body.idQueue, req.body.idCampaign, conn)))
            // se atrapa errores y oculta informacion sensible
            .catch(err => {
                console.error(new Date(), err);
                return Promise.reject<any>('Error al activar o desactivar una campaña')
            });
    };

    public assignUserToQueue = async (req: express.Request): Promise<any> => {
        // se verifica el acceso
        return await super.verifyAccessWithPromise(this.getUser(req), this.getTokenId(req), this.getAccountId(req), this.resource)
            // se obtiene la conexion
            .then(dbName => this.getConnectionWithPromise(dbName))
            // se ejecuta el metodo de negocio activateDeactivate
            .then(conn => this.manage(conn, this.queueModel.assignUserToQueue(req.body.idQueue, req.body.idUser, conn)))
            // se atrapa errores y oculta informacion sensible
            .catch(err => {
                console.error(new Date(), err);
                return Promise.reject<any>('Error al asignar usuario a la cola')
            });
    };

}