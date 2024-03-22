import { FiltersController } from '../controllers/filtersController';
import express from 'express';
import { MainRoute } from './mainRoute';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';

export class FiltersRoute extends MainRoute{
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }

    public routes(): express.Router {
        let router: express.Router = express.Router();
        let filtersController: FiltersController = new FiltersController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);

        router.get('/', filtersController.getFilters);
        router.get('/groups/:id', filtersController.getFiltersProgress);

        router.post('/customers', filtersController.getCountByUsers);

        router.post('/', filtersController.filter);

        router.post('/apply', filtersController.apply);

        return router;
    }
}
