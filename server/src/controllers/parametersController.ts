import * as express from 'express';
import { CallHistory } from '../../../datatypes/callHistory';
import { InitCall } from '../../../datatypes/initCall';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ParameterModel } from '../models/parameters';
import { MainController } from './mainController';

export class ParameterController extends MainController {
    private resource: string;
    private parameterModel: ParameterModel;
    private connection: any;

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.parameterModel = new ParameterModel(controllerConnections);
    }

    public getAllParameters = (req: express.Request, res: express.Response): void => {
        this.connection = this.masterDBController.getMasterConnection().getConnection();
        this.parameterModel.getAll(this.connection, (result: any) => {
            res.send(result);
        });

    };
    public endingCall = (req: express.Request, res: express.Response): void => {
        this.connection = this.masterDBController.getMasterConnection().getConnection();
        let callHistory: CallHistory = req.body.callHistory;
        this.parameterModel.addCallHistoryByIpContact(callHistory, this.connection, (result: any) => {
            res.send(result);
        });
    }
    public initCall = (req: express.Request, res: express.Response): void => {
        this.connection = this.masterDBController.getMasterConnection().getConnection();
        let initCall: InitCall = req.body.initCall;
        this.parameterModel.addCallByIpContact(initCall, this.connection, (result: any) => {
            res.send(result);
        });
    }
    public getLastCall = (req: express.Request, res: express.Response): void => {
        this.connection = this.masterDBController.getMasterConnection().getConnection();
        let customerId: string = req.body.customerId;
        let phone: string = req.body.phone;
        let totalTime: number = req.body.time;
        this.parameterModel.getLastCallByCustomer(customerId, totalTime, this.connection, (result: any) => {
            res.send(result);
        });
    }
    public updateLastCall = (req: express.Request, res: express.Response): void => {
        this.connection = this.masterDBController.getMasterConnection().getConnection();
        let customerId: string = req.body.customerId;
        let phone: string = req.body.phone;
        this.parameterModel.updateLastCallByCustomer(customerId, this.connection, (result: any) => {
            res.send(result);
        });
    }
    public getAgentByTelephone = (req: express.Request, res: express.Response): void => {
        let phone: string = req.body.phone;
        this.parameterModel.getAgentByTelephone(phone, (result: any) => {
            res.send(result);
        });
    }
}
