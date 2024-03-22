import express from 'express';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ReportsController } from '../controllers/reportsController';
import { MainRoute } from './mainRoute';

export class ReportsRoute extends MainRoute {
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }

    public routes(): express.Router {
        let router: express.Router = express.Router();
        let reportsController: ReportsController = new ReportsController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);

        router.post('/customerByCampaigns', reportsController.customerByCampaigns);
        router.post('/callsByAgent', reportsController.callsByAgent);

        router.get('/lastEventForAll', reportsController.lastEventForAll);
        router.get('/deleteOldCustomerCampaigns', reportsController.deleteOldCustomerCampaigns);


        return router;
    }
}
