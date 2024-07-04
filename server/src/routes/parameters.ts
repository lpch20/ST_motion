import { ParameterController} from '../controllers/parametersController';
import express from 'express';
import { MainRoute } from './mainRoute';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class ParametersRoute extends MainRoute{
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

        return router;
    }
}
