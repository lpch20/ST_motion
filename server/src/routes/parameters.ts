import express from 'express';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ParameterController } from '../controllers/parametersController';
import { MainRoute } from './mainRoute';

export class ParametersRoute extends MainRoute {
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }

    public routes(): express.Router {
        let router: express.Router = express.Router();
        let parameterController: ParameterController = new ParameterController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);
        router.get("/getParameters", parameterController.getAllParameters);
        router.post("/endingCall", parameterController.endingCall);
        router.post("/lastCall", parameterController.getLastCall);
        router.post("/getAgentByPhone", parameterController.getAgentByTelephone);

        return router;
    }
}
