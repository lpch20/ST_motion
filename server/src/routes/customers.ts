import express from 'express';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { CustomerController } from '../controllers/customerController';
import { CustomerDebtController } from '../controllers/customerDebtController';
import { MainRoute } from './mainRoute';

export class CustomersRoute extends MainRoute {
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }

    public routes(): express.Router {
        let router: express.Router = express.Router();
        let customerController: CustomerController = new CustomerController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);
        let customerDebtController: CustomerDebtController = new CustomerDebtController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);

        // get all
        router.get('/', customerController.getAll);

        router.get('/next', customerController.getNext);

        router.get('/customerDebt/:idCustomer', customerController.customerDebt);

        router.get('/customerPayments/:idCustomer', customerController.customerPayments);

        router.get('/customerAgreement/:idCustomer', customerController.customerAgreement);

        router.post('/customersCampaign', customerController.getCustomersCampaign);

        router.get('/getCareers', customerController.getCareers);

        router.get('/getDeactiveCustomers', customerController.getDeactiveCustomers);

        router.get('/getCustomersNotAssignedQueue', customerController.getCustomersNotAssignedQueue);

        router.get('/getCustomerForSMS', customerDebtController.getCustomerForSMS);

        router.get('/getPhonesByCustomersById/:id', customerController.getPhonesByCustomersById);

        router.get('/:id', customerController.getCustomerById);

        router.put('/', customerController.update);

        router.post("/find", customerController.findCustomer);

        router.post("/findAllCustomer", customerController.findAllCustomer);

        router.post("/addEvent", customerController.addEvent);

        router.put("/updateItemQueueStatus", customerController.updateItemQueueStatus);

        router.post("/setItemQueueFinish", customerController.setItemQueueFinish);

        return router;
    }
}
