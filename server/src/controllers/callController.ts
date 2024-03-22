import * as express from 'express';
import { Account } from '../../../datatypes/account';
import { CallStatusType } from '../../../datatypes/call';
import { ResultCode } from '../../../datatypes/result';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { AccountModel } from '../models/AccountsModel';
import { CallModel } from '../models/callModel';
import { UserModel } from '../models/userModel';
import { MainController } from './mainController';
const request = require('request');

export class CallController extends MainController {
    private resource: string;
    private callModel: CallModel
    private userModel: UserModel
    private accountModel: AccountModel;

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        this.resource = "users";
        this.callModel = new CallModel(controllerConnections);
        this.userModel = new UserModel(controllerConnections);
        this.accountModel = new AccountModel(masterDBController);
    }

    public makeCall = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            let accountId = parseInt(<string>req.headers['accountid']);

            this.accountModel.getById(accountId, (err: any, account: Account) => {
                if (err) {
                    res.send({
                        result: ResultCode.Error,
                        message: `Error obteniendo la cuenta ${accountId}.`,
                        data: err
                    });
                } else {
                    this.invokeCall(req, res, account, dbName);
                }
            });
        });
    }

    private invokeCall(req: express.Request, res: express.Response, account: Account, dbName: string) {
        let source: string = req.body.source;
        let dest: string = req.body.dest;
        //let hostTarget = "200.108.253.229";
	let hostTarget = "200.40.68.26";
        let portTarget = 6036;
        let pathTarget = `/rest/originateCall?source=${source}&context=default_0&destination=9${dest}&timeout=12`;
        let url = 'http://' + hostTarget + ':' + portTarget + pathTarget;

        const LOCAL_ADDRESS = '179.27.98.14';

        // Set the headers
        var headers = {
            'Content-Type': 'application/x-www-form-urlencoded'
        }

        // Configure the request
        var options = {
            url: url,
            method: 'POST',
            headers: headers,
            localAddress: LOCAL_ADDRESS
        }

        this.getConnection(dbName, res, con => {
            this.userModel.getUserByUsername(<string>req.headers['user'], con, (userResult: any) => {
                let idCustomer: number = req.body.idCustomer;
                let idUser: number = userResult.data[0].id;
                let remoteUser: boolean = userResult.data[0].withoutPhone;

                if (remoteUser) {
                    res.send({
                        result: ResultCode.OK,
                        data: "datos",
                        message: "Llamada desabilitada"
                    });
                } else {
                    this.callModel.getLastCall(idUser, source, con, (callResult) => {
                        if (callResult.result == ResultCode.OK) {
                            if (callResult.data) { // si existe una llamada desde esa extension a ese destino
                                const diffTime = this.calculateSecondsDiff(new Date(), callResult.data.date);
                                const DUPLICATED_DELAY = 3;
                                if (callResult.data.type === CallStatusType.Answered ||
                                    (callResult.data.type === CallStatusType.Calling && diffTime > DUPLICATED_DELAY) ||
                                    (callResult.data.type === CallStatusType.DuplicatedCall && diffTime > DUPLICATED_DELAY)
                                ) {
                                    this.callModel.add(idUser, idCustomer, source, dest, url, CallStatusType.Calling, "", dbName, (result: any) => {
                                        this.call(options, idUser, idCustomer, source, dest, url, dbName, res);
                                    });
                                } else {
                                    this.callModel.add(idUser, idCustomer, source, dest, url, CallStatusType.DuplicatedCall, "", dbName, (result: any) => {
                                        // TODO hacer una clase con los errores posibles
                                        res.send({
                                            result: ResultCode.ERROR_MULTIPLE_CALLS,
                                            message: 'Ya tiene otra llamada en proceso'
                                        });
                                    });
                                }
                            } else {
                                this.callModel.add(idUser, idCustomer, source, dest, url, CallStatusType.Calling, "", dbName, (result: any) => {
                                    this.call(options, idUser, idCustomer, source, dest, url, dbName, res);
                                });
                            }
                        } else {
                            res.send({
                                result: ResultCode.Error,
                                message: 'Error al iniciar la llamada'
                            });
                        }
                    });
                }


            });
        });
    }

    /**
     * 
     * @param options 
     * @param idUser 
     * @param idCustomer 
     * @param source 
     * @param dest 
     * @param url 
     * @param dbName 
     * @param res 
     */
    private call(options: any, idUser: number, idCustomer: number, source: string, dest: string, url: string, dbName: string, res: express.Response) {
        //var creq = http.get(options);
        //var creq = http.request(options);


        let resultCodes: Array<{ "cod": string, message: string }> = new Array<{ "cod": string, message: string }>();
        resultCodes.push({ "cod": "0", "message": "Interno invalido" });
        resultCodes.push({ "cod": "3", "message": "El agente no atiende" });
        resultCodes.push({ "cod": "5", "message": "Interno ocupado" });

        // const resultCall: Array<any> = new Array<any>();
        // resultCall.push({ "error": "0" });
        // resultCall.push({ "error": "3" });
        // resultCall.push({ "error": "5" });
        // resultCall.push({ "error": "0", "uniqueid": "342423" });


        // const resultIndex = Math.floor((Math.random() * 4) + 0);
        // const result = resultCall[resultIndex];

        // Start the request
        request(options, (error: any, response: any, body: any) => {
            if (!error && response.statusCode == 200) {
                // Print out the response body
                console.log(body)
                let dataResponse = JSON.parse(body);

                if (dataResponse.uniqueid) {
                    this.callModel.add(idUser, idCustomer, source, dest, url, 2, body, dbName, (result: any) => {
                        res.send({
                            result: ResultCode.OK,
                            data: "datos",
                            message: "Llamada realizada con exito"
                        });
                    });
                } else {
                    const resultMatch = resultCodes.filter(r => r.cod === dataResponse.error)[0];
                    if (resultMatch) {
                        res.send({
                            result: ResultCode.Error,
                            data: "datos",
                            message: resultMatch.message
                        });
                    } else {
                        res.send({
                            result: ResultCode.Error,
                            data: "datos",
                            message: "Error desconocido"
                        });
                    }
                }
            } else {
                res.send({
                    result: ResultCode.Error,
                    message: 'Error al iniciar la llamada',
                    data: error
                });
            }
        })

        // creq.on('response', (resp: any) => {
        //     let data: string = '';
        //     // A chunk of data has been recieved.
        //     resp.on('data', (chunk: any) => {
        //         data += chunk;
        //     });
        //     // The whole response has been received. Print out the result.
        //     resp.on('end', () => {
        //         let dataResponse = JSON.parse(data);

        //         if (dataResponse.uniqueid) {
        //             this.callModel.add(idUser, idCustomer, source, dest, url, 2, data, dbName, (result: any) => {
        //                 res.send({
        //                     result: ResultCode.OK,
        //                     data: "datos",
        //                     message: "Llamada realizada con exito"
        //                 });
        //             });
        //         } else {
        //             const resultMatch = resultCodes.filter(r => r.cod === dataResponse.error)[0];
        //             if (resultMatch) {
        //                 res.send({
        //                     result: ResultCode.Error,
        //                     data: "datos",
        //                     message: resultMatch.message
        //                 });
        //             } else {
        //                 res.send({
        //                     result: ResultCode.Error,
        //                     data: "datos",
        //                     message: "Error desconocido"
        //                 });
        //             }
        //         }

        //     });

        // }).on('error', (e: any) => {
        //     res.send({
        //         result: ResultCode.Error,
        //         message: 'Error al iniciar la llamada',
        //         data: e
        //     });
        // });

    }



    // private invokeCall(req: express.Request, res: express.Response, account: Account, dbName: string) {

    //     let source: string = req.body.source;
    //     let dest: string = req.body.dest;

    //     let hostTarget = account.servicePath;
    //     let portTarget = 5003;
    //     let pathTarget = '/makecall.php?origen=' + source + '&destino=' + dest;
    //     let url = 'http://' + hostTarget + ':' + portTarget + pathTarget;

    //     const LOCAL_ADDRESS = '179.27.98.14';

    //     var options: any = {
    //         port: portTarget,
    //         host: hostTarget,
    //         path: pathTarget,
    //         localAddress: LOCAL_ADDRESS,
    //         headers: { 'Referer': url }
    //     };

    //     this.getConnection(dbName, res, con => {
    //         this.userModel.getUserByUsername(<string>req.headers['user'], con, (userResult: any) => {
    //             let idCustomer: number = req.body.idCustomer;
    //             let idUser: number = userResult.data[0].id;
    //             this.callModel.getLastCall(idUser, source, con, (callResult) => {
    //                 if (callResult.result == ResultCode.OK) {
    //                     if (callResult.data) { // si existe una llamada desde esa extension a ese destino
    //                         const diffTime = this.calculateSecondsDiff(new Date(), callResult.data.date);
    //                         const DUPLICATED_DELAY = 3;
    //                         if (callResult.data.type === CallStatusType.Answered ||
    //                             (callResult.data.type === CallStatusType.Calling && diffTime > DUPLICATED_DELAY) ||
    //                             (callResult.data.type === CallStatusType.DuplicatedCall && diffTime > DUPLICATED_DELAY)
    //                         ) {
    //                             this.callModel.add(idUser, idCustomer, source, dest, url, CallStatusType.Calling, "", dbName, (result: any) => {
    //                                 this.call(options, idUser, idCustomer, source, dest, url, dbName, res);
    //                             });
    //                         } else {
    //                             this.callModel.add(idUser, idCustomer, source, dest, url, CallStatusType.DuplicatedCall, "", dbName, (result: any) => {
    //                                 // TODO hacer una clase con los errores posibles
    //                                 res.send({
    //                                     result: ResultCode.ERROR_MULTIPLE_CALLS,
    //                                     message: 'Ya tiene otra llamada en proceso'
    //                                 });
    //                             });
    //                         }
    //                     } else {
    //                         this.callModel.add(idUser, idCustomer, source, dest, url, CallStatusType.Calling, "", dbName, (result: any) => {
    //                             this.call(options, idUser, idCustomer, source, dest, url, dbName, res);
    //                         });
    //                     }
    //                 } else {
    //                     res.send({
    //                         result: ResultCode.Error,
    //                         message: 'Error al iniciar la llamada'
    //                     });
    //                 }
    //             });
    //         });
    //     });
    // }

    /**
     * 
     * @param options 
     * @param idUser 
     * @param idCustomer 
     * @param source 
     * @param dest 
     * @param url 
     * @param dbName 
     * @param res 
     */
    // private call(options: any, idUser: number, idCustomer: number, source: string, dest: string, url: string, dbName: string, res: express.Response) {
    //     var creq = http.get(options);
    //     creq.on('response', (resp: any) => {
    //         let data: string = '';
    //         // A chunk of data has been recieved.
    //         resp.on('data', (chunk: any) => {
    //             data += chunk;
    //         });
    //         // The whole response has been received. Print out the result.
    //         resp.on('end', () => {
    //             this.callModel.add(idUser, idCustomer, source, dest, url, 2, data, dbName, (result: any) => {
    //                 let dataResponse = JSON.parse(data);
    //                 let resultResponse = dataResponse.codigofalla === null ?
    //                     ResultCode.OK :
    //                     ResultCode.Error;
    //                 res.send({
    //                     result: resultResponse,
    //                     data: dataResponse,
    //                     message: dataResponse.codigofalla
    //                 });
    //             });
    //         });
    //     }).on('error', (e: any) => {
    //         res.send({
    //             result: ResultCode.Error,
    //             message: 'Error al iniciar la llamada',
    //             data: e
    //         });
    //     });
    // }
}
