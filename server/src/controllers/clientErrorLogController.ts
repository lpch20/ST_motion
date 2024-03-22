import { Result } from '../../../datatypes/result';
import { MainController } from './mainController';
import * as express from 'express';
import { ClientErrorLoggerModel } from '../models/clientErrorLoggerModel';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class ClientErrorLoggerController extends MainController {
    private resource: string;
    private clientErrorLoggerModel: ClientErrorLoggerModel;
    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.clientErrorLoggerModel = new ClientErrorLoggerModel();
    }

    public log = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, con => {
                this.clientErrorLoggerModel.add(req.body.error, con, (r: Result) => {
                    res.send(r);
                });
            });
        });
    }
}