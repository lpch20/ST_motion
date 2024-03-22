import { ResultWithData, ResultCode } from '../../../datatypes/result';
import { MainController } from './mainController';
import { ScheduleModel } from '../models/ScheduleModel';
import { UserModel } from '../models/userModel';
import { VSchedule } from '../../../datatypes/viewDataType/VSchedule';
import { EngagementModel } from '../models/EngagementModel';
import { Engagement } from '../../../datatypes/viewDataType/engagement';
import * as express from 'express';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class EngagementController extends MainController {
    private resource: string;
    private engagementModel: EngagementModel;
    private userModel: UserModel;
    private scheduleModel: ScheduleModel;
    
    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.engagementModel = new EngagementModel();
        this.userModel = new UserModel(controllerConnections);
        this.scheduleModel = new ScheduleModel();
    }

    public add = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, con => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (r: ResultWithData<any[]>) => {
                    if (r.result > 0 && r.data && r.data.length > 0) {
                        var idUser = r.data[0].id;
                        let engagement: Engagement = req.body.engagement;
                        this.engagementModel.add(engagement, con, (result: any) => {
                            if (engagement.callAgain) {
                                let schedule: VSchedule = new VSchedule();
                                schedule.active = true;
                                schedule.date = engagement.callAgain;
                                schedule.subject = engagement.annotation;
                                schedule.idUser = idUser;
                                schedule.idCustomer = engagement.idCustomer;
                                schedule.phoneNumber = engagement.phoneNumber;

                                this.scheduleModel.add(schedule, con, (result: any) => {
                                    res.send(result);
                                });
                            } else {
                                res.send(result);
                            }
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

    public getEngagementsByCurrentUserByDate = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (responseUser: any) => {
                    if (responseUser.result > 0 && responseUser.data && responseUser.data.length) {
                        var userId = responseUser.data[0].id;
                        this.engagementModel.getCustomersByUserByDateFromEngagements(userId, req.body.dateFrom, req.body.dateTo, con, (resultCustomers: any) => {
                            if (resultCustomers.result > 0 && resultCustomers.data && resultCustomers.data.length > 0) {
                                let idCustomers = resultCustomers.data.map((c: any) => c.idCustomer);
                                this.getEngagementsByCustomers(idCustomers, 0, new Array<Engagement>(), con, (r: any) => {
                                    res.send({
                                        result: ResultCode.OK,
                                        data: r
                                    });
                                });
                            } else {
                                res.send({
                                    result: ResultCode.OK,
                                    data: []
                                });
                            }
                        });
                    } else {
                        res.send({
                            result: ResultCode.Error,
                            message: 'Usuario no existe o no esta logeado'
                        });
                    }
                });
            });
        })
    }

    public getEngagementsByDate = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                let userId: number = req.body.userId;
                let dateFrom: Date = req.body.dateFrom;
                let dateTo: Date = req.body.dateTo;

                if (userId) {
                    this.engagementModel.getCustomersByUserByDateFromEngagements(userId, dateFrom, dateTo, con, (resultCustomers: any) => {
                        let idCustomers = resultCustomers.data.map((c: any) => c.idCustomer);
                        this.getEngagementsByCustomers(idCustomers, 0, new Array<Engagement>(), con, (r: any) => {
                            res.send({ result: ResultCode.OK, data: r });
                        });
                    });
                } else {
                    this.engagementModel.getCustomersByDateFromEngagements(dateFrom, dateTo, con, (resultCustomers: any) => {
                        let idCustomers = resultCustomers.data.map((c: any) => c.idCustomer);
                        this.getEngagementsByCustomers(idCustomers, 0, new Array<Engagement>(), con, (r: any) => {
                            res.send({ result: ResultCode.OK, data: r });
                        });
                    });
                }
            });
        });
    }

    public getEngagementsByCustomer = (req: express.Request, res: express.Response): void => {
        var mainThis = this;
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            var pool = mainThis.controllerConnections.getUserConnection(dbName);
            pool.getConnection(function (err: any, con: any) {
                if (!!err) {
                    res.send({ result: ResultCode.Error, message: "Error al crear la conexion" });
                } else {
                    mainThis.engagementModel.getEngagementsByCustomer(req.params.idCustomer, con, function (r: ResultWithData<any[]>) {
                        con.release();
                        if (r.result > 0 && r.data) {
                            res.send({ result: ResultCode.OK, data: r.data });
                        } else {
                            res.send({ result: ResultCode.OK, data: [] });
                        }
                    });
                }
            });
        });
    };

    private getEngagementsByCustomers(idCustomers: number[], indexIdCustomer: number,
        engagements: any[], con: any, callBack: (r: any) => void): void {
        let mainThis = this;
        if (indexIdCustomer < idCustomers.length) {
            this.engagementModel.getEngagementsByCustomer(idCustomers[indexIdCustomer], con, function (r: any) {
                if (r.result > 0) {
                    for (let i = 0; i < r.data.length; i++) {
                        engagements.push(r.data[i]);
                    }
                }
                mainThis.getEngagementsByCustomers(idCustomers, indexIdCustomer + 1, engagements, con, callBack);
            });
        } else {
            callBack(engagements);
        }
    }

}

