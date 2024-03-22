import { ResultWithData, ResultCode } from '../../../datatypes/result';
import { MainController } from './mainController';
import { BreakModel } from '../models/BreakModel';
import { UserModel } from '../models/userModel';
import * as express from 'express';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class BreakController extends MainController {

    private resource: string;
    private breakModel: BreakModel;
    private userModel: UserModel;

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.breakModel = new BreakModel();
        this.userModel = new UserModel(controllerConnections);
    }

    public getAll = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.breakModel.getAll(con, (result: any) => {
                    res.send(result);
                });
            });
        });
    }

    public add = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (result: ResultWithData<any[]>) => {
                    if (result.data && result.data.length > 0) {
                        var idUser = result.data[0].id;
                        this.breakModel.add(idUser, req.body.breakTime, con, (result: any) => {
                            res.send(result);
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
    };

    public getByUser = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.breakModel.getBreakByUser(req.params.userId, con, (result: any) => {
                    res.send(result);
                });
            });
        });
    }

    public getByCurrentUser = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName,  (con) => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (result: ResultWithData<any[]>) => {
                    if (result.data && result.data.length > 0) {
                        var idUser = result.data[0].id;
                        this.breakModel.getBreakByUser(idUser, con, (result: any) => {
                            res.send(result);
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
    };

    public getLastByCurrentUser = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (result: ResultWithData<any[]>) => {
                    if (result.data !== undefined && result.data.length > 0) {
                        var idUser = result.data[0].id;
                        this.breakModel.getLastByCurrentUser(idUser, con, (result: any) => {
                            res.send(result);
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

    public getLastBreaks = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.breakModel.getLastBreaks(con, (response: any) => {
                    res.send(response);
                });
            });
        });
    };

    public getBreakByDate = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.breakModel.getBreakByUserByDate(req.body.userId, req.body.dateFrom, req.body.dateTo, con, (result: any) => {
                    res.send(result);
                });
            });
        });
    };

    public getBreakByCurrentUserByDate = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName,  (con) => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (result: ResultWithData<any[]>) => {
                    if (result.data && result.data.length > 0) {
                        var idUser = result.data[0].id;
                        this.breakModel.getBreakByUserByDate(idUser, req.body.dateFrom, req.body.dateTo, con, (result: any) => {
                            res.send(result);
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
    };
}
