import express from 'express';
import { EventsController } from '../controllers/eventsController';
import { MainRoute } from './mainRoute';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class EventsRoute extends MainRoute{
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }

    public routes(): express.Router {
        let router: express.Router = express.Router();
        let eventsController: EventsController = new EventsController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);
        router.get('/getEventByCurrentUser', eventsController.getEventByCurrentUser);
        router.get('/getEventsByCustomer/:idCustomer', eventsController.getEventByCustomer);
        router.post('/getEventByDate', eventsController.getEventByDate);  
        router.post('/getEventByCurrentUserByDate', eventsController.getEventByCurrentUserByDate);   
        router.post('/getEventCountTypeByUser', eventsController.getEventCountTypeByUser);            

        return router;
    }
}
