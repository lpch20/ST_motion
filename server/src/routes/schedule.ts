import { ScheduleController} from '../controllers/scheduleController';
import express from 'express';
import { MainRoute } from './mainRoute';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class ScheduleRoute extends MainRoute{
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }

    public routes(): express.Router {
        let router: express.Router = express.Router();
        let scheduleController: ScheduleController = new ScheduleController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);
        router.get("/", scheduleController.getByUser);
        router.get("/getScheduleDayByUser", scheduleController.getScheduleDayByUser);        
        router.post("/", scheduleController.add);
        router.post("/getByDate", scheduleController.getByDate);
        router.post("/getByCurrentUserByDate", scheduleController.getByCurrentUserByDate);
        router.put("/updateScheduleResolve", scheduleController.updateScheduleResolve);
        
        return router;
    }
}
