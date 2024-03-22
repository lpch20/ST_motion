import express from 'express';
import { BreakController } from '../controllers/BreakController';
import { MainRoute } from './mainRoute';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class BreaksRoute extends MainRoute{
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }

    public routes(): express.Router {
        let router: express.Router = express.Router();
        let breakController: BreakController = new BreakController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);

        router.get('/', breakController.getAll);

        router.get('/getByCurrentUser', breakController.getByCurrentUser);

        router.get('/getLastByCurrentUser', breakController.getLastByCurrentUser);        

        router.post('/getBreakByDate',breakController.getBreakByDate);

        router.get('/getLastBreaks',breakController.getLastBreaks);

        router.post('/getBreakByCurrentUserByDate',breakController.getBreakByCurrentUserByDate);

        router.get('/:userId',breakController.getByUser);

        router.post('/', breakController.add);

        
        return router;
    }
}
