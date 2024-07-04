import { MainController } from './mainController';
import { ParameterModel } from '../models/parameters';
import * as express from 'express';
import { CallHistory } from '../../../datatypes/callHistory';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class ParameterController extends MainController {
    private resource: string;
    private parameterModel: ParameterModel;    
    private connection:any;

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
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.parameterModel.getAll(dbName,  (result: any) => {
                res.send(result);
            });
        });
    };
    public endingCall = (req: express.Request, res: express.Response): void => {
       this.connection= this.masterDBController.getMasterConnection().getConnection();
       let callHistory: CallHistory = req.body.callHistory;
       this.parameterModel.addCallHistoryByIpContact(callHistory,this.connection,  (result: any) =>
         {
        res.send(result);
        });
    }
    public getLastCall = (req: express.Request, res: express.Response): void => {
        this.connection= this.masterDBController.getMasterConnection().getConnection();
        let customerId: string = req.body.customerId;
        this.parameterModel.getLastCallByCustomer(customerId,this.connection,  (result: any) =>
          {
         res.send(result);
         });
     }
}
