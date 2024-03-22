import { ResultWithData, ResultCode } from '../../../datatypes/result';
import { MainController } from './mainController';
import { ScheduleModel } from '../models/ScheduleModel';
import { UserModel } from '../models/userModel';
import { VSchedule } from '../../../datatypes/viewDataType/VSchedule';
import * as express from 'express';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class ScheduleController extends MainController {
    private resource: string;
    private scheduleModel: ScheduleModel;
    private userModel: UserModel;

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.scheduleModel = new ScheduleModel();
        this.userModel = new UserModel(controllerConnections);
    }

    public add = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName,(con) => {
                let user = <string>req.headers['user'];
                this.userModel.getUserByUsername(user, con, (r: ResultWithData<any[]>) => {
                    if (r.result > 0 && r.data && r.data.length > 0) {
                        let schedule: VSchedule = req.body.schedule;
                        schedule.idUser = r.data[0].id;
                        this.scheduleModel.add(schedule, con, (result: any) => {
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

    public getByUser = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName,  (con) => {
                let user = <string>req.headers['user'];
                this.userModel.getUserByUsername(user, con, (r: ResultWithData<any[]>) => {
                    if (r.result > 0 && r.data && r.data.length > 0) {
                        let userId: number = r.data[0].id;
                        this.scheduleModel.getAllByUser(userId, con, (result: any) => {
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

    public getScheduleDayByUser = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                let user = <string>req.headers['user'];
                this.userModel.getUserByUsername(user, con, (r: ResultWithData<any[]>) => {
                    if (r.result > 0 && r.data && r.data.length > 0) {
                        let userId: number = r.data[0].id;
                        this.scheduleModel.getScheduleDayByUser(userId, con, (result: any) => {
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

    public getByDate = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                this.scheduleModel.getAllByUserByDate(req.body.userId, req.body.dateFrom, req.body.dateTo, con, (result: any) => {
                    res.send(result);
                });
            });
        });
    };

    public updateScheduleResolve = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                this.scheduleModel.updateScheduleResolve(req.body.id, req.body.resolved, con, (result: any) => {
                    res.send(result);
                });
            });
        });
    };

    public getByCurrentUserByDate = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                let user = <string>req.headers['user'];
                this.userModel.getUserByUsername(user, con, (r: ResultWithData<any[]>) => {
                    if (r.result == ResultCode.OK && r.data && r.data.length > 0) {
                        let userId: number = r.data[0].id;
                        this.scheduleModel.getAllByUserByDate(userId, req.body.dateFrom, req.body.dateTo, con, (result: any) => {
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
}
