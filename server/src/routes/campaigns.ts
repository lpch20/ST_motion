import express from 'express';
import { CampaignController } from '../controllers/campaignController';
import { MainRoute } from './mainRoute';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class CampaignRoute extends MainRoute{
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }
    public routes(): express.Router {
        let router: express.Router = express.Router();
        let campaignsController: CampaignController = new CampaignController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);

        // Gets all the campaigns
        router.get('/', this.asyncHandler(campaignsController.getAll));

        // Gets all the active campaigns
        router.get('/getActive', this.asyncHandler(campaignsController.getActive));

        // Activate or deactive a campaign
        router.put('/activateDeactivate', this.asyncHandler(campaignsController.activateDeactivate));

        return router;
    }
}
