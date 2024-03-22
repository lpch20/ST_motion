import * as express from 'express';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { QueueController } from '../controllers/queueController';
import { MainRoute } from './mainRoute';

export class QueueRoute extends MainRoute {
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }

    public routes(): express.Router {
        let router: express.Router = express.Router();
        let queueController: QueueController = new QueueController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);

        router.get("/", queueController.getAll);
        router.post("/", queueController.assignCustomersQueue);
        router.get("/getCustomersByQueue/:idQueue/:ci/:idCampaign", queueController.getCustomersByQueue);
        router.put("/updateCustomersQueue", queueController.updateCustomersQueue);

        router.get("/getusersbyqueue/:idQueue", this.asyncHandler(queueController.getUsersByQueue));
        router.get("/getcampaignsbyqueue/:idQueue", this.asyncHandler(queueController.getCampaignsByQueue));

        router.put("/assignCustomerFromCampaignToQueue", this.asyncHandler(queueController.assignCustomerFromCampaignToQueue));

        router.put("/assignUserToQueue", this.asyncHandler(queueController.assignUserToQueue));

        return router;
    }
}
