import * as express from 'express';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ActionModel } from '../models/actionModel';
import { MainController } from './mainController';

export class ActionController extends MainController {
    private resource: string;
    private actionModel: ActionModel;

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.actionModel = new ActionModel();
    }

    public getAll = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.actionModel.getAll(con, (result: any) => {
                    res.send(result);
                });
            });
        });
    };
}
