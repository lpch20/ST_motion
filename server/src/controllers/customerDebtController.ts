import { ResultCode } from '../../../datatypes/result';
import { MainController } from './mainController';
import { DebtModel } from '../models/CustomerDebtModel';
import * as express from 'express';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class CustomerDebtController extends MainController {
    private resource: string;
    private debtDataModel: DebtModel;

    configPath: string = 'server/config/assign.json'; 
    users:Array<number> = new Array();

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.debtDataModel = new DebtModel();
    }

    public getCustomerForSMS = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {

                this.debtDataModel.getCustomerForSMS(con, (result: any) => {
                    if (result.data !== undefined && result.data.length > 0) {
                        res.send(result);
                    } else {
                        res.send({
                            result: ResultCode.Error,
                            message: 'No hay clinetes para mandar sms'
                        });
                    }
                });
            });
        });
    }
}
