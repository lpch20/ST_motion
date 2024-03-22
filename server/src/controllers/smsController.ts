import { ResultCode } from '../../../datatypes/result';
import { MainController } from './mainController';
import * as express from 'express';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
var rp = require('request-promise');

export class SmsController extends MainController {

    private resource: string;
    
    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
    }

    public send = (req: express.Request, res: express.Response): void => {
        let phone = req.body.phone;

        this.verifyAccess(req, res, this.resource, (dbName: string) => {

            super.errorHandler(dbName, () => {
                rp({
                    method: 'POST',
                    uri: 'https://190.64.151.34:8888/stsms/WSsms.php',
                    rejectUnauthorized: false,
                    body: {
                        token: "s1mpl3t3chSMS!",
                        id_camp: 1,
                        arrayCel: [phone]
                    },
                    json: true // Automatically stringifies the body to JSON
                }).then(function (parsedBody: any) {
                    // POST succeeded...
                    res.send({ result: ResultCode.OK, message: "Enviado correctamente al " + phone });
                })
                    .catch(function (err: any) {
                        // POST failed...
                        res.send({ result: ResultCode.Error, message: "Enviado con error al " + phone });
                    });
            });
        });
    }
}

