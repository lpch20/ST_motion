import { UserController} from '../controllers/usersController';
import * as express from 'express';
import { MainRoute } from './mainRoute';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class AccountsRoute extends MainRoute{
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }

    public routes(): express.Router {
        let router: express.Router = express.Router();        
        let userController:UserController = new UserController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);
        
        router.get("/", userController.getAll);
        return router;
    }
}