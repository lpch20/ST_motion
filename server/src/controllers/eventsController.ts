import { ResultWithData, ResultCode } from '../../../datatypes/result';
import { MainController } from './mainController';
import { UserModel } from '../models/userModel';
import { EventsModel } from '../models/eventsModel';
import * as express from 'express';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class EventsController extends MainController {
    private resource: string;
    private eventsModel: EventsModel;
    private userModel: UserModel;

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.eventsModel = new EventsModel(controllerConnections);
        this.userModel = new UserModel(controllerConnections);
    }

    public getEventByCustomer = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, con => {
                this.eventsModel.getEventsByCustomer(req.params.idCustomer, con, (r: ResultWithData<any[]>) => {
                    res.send(r);
                });
            });
        });
    }

    public getEventByCurrentUser = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, con => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (result: ResultWithData<any[]>) => {
                    if (result.data && result.data.length > 0) {
                        var idUser = result.data[0].id;
                        this.eventsModel.getEventsByUser(idUser, dbName, (r: ResultWithData<any[]>) => {
                            res.send(r);
                        });
                    } else {
                        res.send({
                            result: ResultCode.Error,
                            message: 'Usuario no existe o no esta logeado'
                        });
                    }
                });
            });
        });
    }

    public getEventByDate = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.eventsModel.getEventByUserByDate(req.body.userId, req.body.dateFrom, req.body.dateTo, con, (r: ResultWithData<any[]>) => {
                    res.send(r);
                });
            });
        });
    }

    public getEventByCurrentUserByDate = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (result: ResultWithData<any[]>) => {
                    if (result.data !== undefined && result.data.length > 0) {
                        var idUser = result.data[0].id;
                        this.eventsModel.getEventByUserByDate(idUser, req.body.dateFrom, req.body.dateTo, con, (r: ResultWithData<any[]>) => {
                            res.send(r);
                        });
                    } else {
                        res.send({
                            result: ResultCode.Error,
                            message: 'Usuario no existe o no esta logeado'
                        });
                    }
                });
            });
        });
    }

    public getEventCountTypeByUser  = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.eventsModel.getEventCountTypeByUser(req.body.userId, req.body.dateFrom, req.body.dateTo, con, (r: ResultWithData<any[]>) => {
                    res.send(r);
                });
            });
        });
    }
}
