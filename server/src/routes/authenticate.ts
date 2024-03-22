import { AuthenticateController} from '../controllers/authenticateController';
import express from 'express';
import { MainRoute } from './mainRoute';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class AuthenticateRoute extends MainRoute{
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }

    public routes(): express.Router {
        let router: express.Router = express.Router();
        let authenticateController: AuthenticateController = new AuthenticateController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);

        router.post('/login', authenticateController.login);

        router.post('/changePasswordAndLogin', authenticateController.changePasswordAndLogin);        

        router.get('/verifyToken', authenticateController.verifyToken);

        router.get('/closeSession/:agent', authenticateController.closeSession);

        router.get('/cleanSessions', authenticateController.cleanSessions);

        return router;
    }
}
