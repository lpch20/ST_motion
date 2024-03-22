import express from 'express';
import { EngagementController } from '../controllers/engagementController';
import { MainRoute } from './mainRoute';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class EngagementRoute extends MainRoute{
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }

    public routes(): express.Router {
        let router: express.Router = express.Router();
        let engagementController: EngagementController = new EngagementController(this. masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);

        router.post('/', engagementController.add);
        router.post('/getEngagementsByCurrentUserByDate', engagementController.getEngagementsByCurrentUserByDate);
        router.post('/getEngagementsByDate', engagementController.getEngagementsByDate);
        router.get('/getEngagementsByCustomer/:idCustomer', engagementController.getEngagementsByCustomer);

        return router;
    }
}
