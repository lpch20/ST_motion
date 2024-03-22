import express from 'express';
import multer from 'multer';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { CustomerController } from '../controllers/customerController';
import { ImportCustomerDebtController } from '../controllers/importCustomerDebtController';
import { ImportCustomerPaymentsController } from '../controllers/importCustomerPaymentsController';
import { MassiveEditController } from '../controllers/massiveEditController';
import { MainRoute } from './mainRoute';

export class ImportCustomerDataRoute extends MainRoute {
    constructor(private masterDBController: ControllerDBMaster,
        private controllerConnections: ControllerDBClientsConnections,
        private controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        private acl: NewACL) {
        super();
    }

    public routes(): express.Router {
        let router: express.Router = express.Router();
        const upload = multer({ dest: 'tmp/csv/' });
        const importCustomerPayments: ImportCustomerPaymentsController = new ImportCustomerPaymentsController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);
        let customerController: CustomerController = new CustomerController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);
        let massiveEditController: MassiveEditController = new MassiveEditController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);
        let importCustomerDebtController: ImportCustomerDebtController = new ImportCustomerDebtController(this.masterDBController, this.controllerConnections, this.controllerPromiseConnections, this.acl);

        /**
         * Comienza la importacion de los datos de pagos de los customers
         */
        router.post('/importPayments', importCustomerPayments.paymentData);

        /**
         * Comienza la importacion de la asignacion de campañas de los customers a los agentes
         */
        router.post('/importCampaignsData', importCustomerDebtController.importCampaignsData);

        /**
         * Comienza la importacion de los customers
         */
        router.post('/customerData', customerController.addCustomers);


        /**
         * Comienza la importacion de los customers
         */
        router.post('/allCustomerData', customerController.allCustomers);

        /**
         * Comienza la importacion de los datos de deuda de los customers 
         */
        router.post('/importDeuda', importCustomerDebtController.debtData);

        /**
         * Comienza la importacion de las fechas de asignacion de CD a Requiro 
         */
        router.post('/importDatesAssign', importCustomerDebtController.importDatesAssign);

        /**
         * Comienza la importacion de los convenios
         */
        router.post('/importAgreements', importCustomerDebtController.importAgreements);

        /**
         * Envia resumen de la importacion
         */
        router.post('/sendImportSummary', customerController.sendImportSummary.bind(customerController));


        /**
         * Cambio masivo de campania
         */
        router.post('/changeCampaign', upload.single('file'), massiveEditController.changeCampaign);

        /**
         * Cambio masivo de cola
         */
        router.post('/changeQueue', upload.single('file'), massiveEditController.changeQueue);


        router.post('/changeCampaignAndQueue', upload.single('file'), massiveEditController.changeCampaignAndQueue);

        return router;
    }
}
