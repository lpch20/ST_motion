import { MainController } from './mainController';
import { ResultCode } from '../../../datatypes/result';
import * as express from 'express';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
const http = require('http');

export class GetPaidController extends MainController {

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
    }
 
    public get = (req: express.Request, res: express.Response): void => {
        console.log('GetPaidController.get');
        this.makeCall(req, res, 'get');
    }
    public post = (req: express.Request, res: express.Response): void => {
        console.log('GetPaidController.post');
        this.makeCall(req, res, 'post'); 
    }

    private makeCall(req: express.Request, res: express.Response, type: string) {
        let source: string = req.query.source;
        let dest: string = req.query.dest;
        const makeCallUrl = 'http://190.64.151.34:5003/makecall.php';
        http.get(makeCallUrl + `?origen=${source}&destino=${dest}`, (resp: any) => {
            let data = '';
            // A chunk of data has been recieved.
            resp.on('data', (chunk: any) => {
                data += chunk;
            });
            // The whole response has been received. Print out the result.
            resp.on('end', () => {
                let dataResponse = JSON.parse(data);
                let resultResponse = -1;
                if (dataResponse.codigofalla === null) {
                    resultResponse = 1;
                }
                res.send({
                    result: resultResponse,
                    data: dataResponse,
                    message: 'OK'
                });
            });
        }).on("error", (err: any) => {
            console.log("Error: " + err.message);
            res.send({
                result: ResultCode.Error,
                message: err.message
            });
        });
    }
}
