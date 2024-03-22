import * as express from 'express';
// import csv from 'fast-csv';
// import fs from 'fs';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { CustomerModel } from '../models/customerModel';
import { IPromiseConnection, MainController } from './mainController';


export class MassiveEditController extends MainController {

    private resource: string;
    private customerModel: CustomerModel;


    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.customerModel = new CustomerModel(controllerConnections);
    }

    public changeCampaign = (req: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(req, httpRes, this.resource, async (dbName: string) => {
            let conn: IPromiseConnection;
            try {
                conn = await this.getConnectionWithPromise(dbName);
                const idUser: number = 1;
                let countOK = 0;
                let countError = 0;

                const idLog = await this.customerModel.logMassiveUpdateStart(idUser, "Change_Campaign", countOK, countError, conn);
                const fileRows: any[] = [];


                //     // open uploaded file
                // csv.fromPath(req.file.path)
                //     .on("data", function (data) {
                //         fileRows.push({ "ci": data[0], "idCampaign": data[1] }); // push each row
                //     })
                //     .on("end", async () => {
                //         console.log(fileRows)
                //         const totalRows = fileRows.length;

                //         for (let i = 1; i < totalRows; i++) {
                //             const customerId = await this.customerModel.getCustomerIdByCIPromise(fileRows[i].ci, conn);
                //             await conn.query('START TRANSACTION');
                //             await this.customerModel.cleanCustomerCampaignByCustomer(customerId, conn);

                //             try {
                //                 await this.customerModel.assignCustomerCampaign(customerId, fileRows[i].idCampaign, idUser, conn);
                //                 await conn.query("COMMIT");
                //                 countOK++;
                //             } catch (err) {
                //                 console.error(`Error al asignar el cliente ${fileRows[i].ci}, id ${customerId}`);
                //                 await conn.query('ROLLBACK');
                //                 countError++;
                //             }

                //         }

                //         await this.customerModel.logMassiveUpdateEnd(idLog, countOK, countError, conn);
                //         fs.unlinkSync(req.file.path);   // remove temp file
                //         //process "fileRows" and respond
                //         const logData = await this.customerModel.logMassiveData(idLog, conn);
                //         httpRes.send({ message: "Termino la importacion", data: logData });
                //     });
            } catch (err) {
                console.error(err);
            }
        });
    }

    public changeQueue = (req: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(req, httpRes, this.resource, async (dbName: string) => {
            let conn: IPromiseConnection;
            try {
                conn = await this.getConnectionWithPromise(dbName);
                const idUser: number = 1;
                let countOK = 0;
                let countError = 0;

                const idLog = await this.customerModel.logMassiveUpdateStart(idUser, "Cahnge_Queue", countOK, countError, conn);
                const fileRows: any[] = [];

                //     // open uploaded file
                // csv.fromPath(req.file.path)
                //     .on("data", function (data) {
                //         fileRows.push({ "ci": data[0], "idQueue": data[1] }); // push each row
                //     })
                //     .on("end", async () => {
                //         console.log(fileRows)
                //         const totalRows = fileRows.length;

                //         for (let i = 1; i < totalRows; i++) {
                //             const customerId = await this.customerModel.getCustomerIdByCIPromise(fileRows[i].ci, conn);
                //             await conn.query('START TRANSACTION');
                //             try {
                //                 await this.customerModel.updateCustomerQueue(fileRows[i].idQueue, customerId, conn);
                //                 await conn.query("COMMIT");
                //                 countOK++;
                //             } catch (err) {
                //                 console.error(`Error al cambiar de cola el cliente ${fileRows[i].ci}, id ${customerId}`);
                //                 await conn.query('ROLLBACK');
                //                 countError++;
                //             }
                //         }

                //         await this.customerModel.logMassiveUpdateEnd(idLog, countOK, countError, conn);
                //         fs.unlinkSync(req.file.path);   // remove temp file
                //         //process "fileRows" and respond
                //         httpRes.send({ message: "Termino la importacion" });
                //     });
            } catch (err) {
                console.error(err);
            }
        });
    }

    public changeCampaignAndQueue = (req: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(req, httpRes, this.resource, async (dbName: string) => {
            let conn: IPromiseConnection;
            try {
                conn = await this.getConnectionWithPromise(dbName);

                let countOK = 0;
                let countError = 0;
                //TODO acomodar
                const idUser: number = 1;
                const idLog = await this.customerModel.logMassiveUpdateStart(idUser, "Change_Campaign_Queue", countOK, countError, conn);
                const fileRows: any[] = [];

                // open uploaded file
                // csv.fromPath(req.file.path)
                //     .on("data", function (data) {
                //         fileRows.push({ "ci": data[0], "idQueue": data[1], "idCampaign": data[2] }); // push each row
                //     })
                //     .on("end", async () => {
                //         console.log(fileRows)
                //         const totalRows = fileRows.length;

                //         for (let i = 1; i < totalRows; i++) {
                //             const customerId = await this.customerModel.getCustomerIdByCIPromise(fileRows[i].ci, conn);

                //             try {
                //                 await conn.query('START TRANSACTION');
                //                 await this.customerModel.cleanCustomerCampaignByCustomer(customerId, conn);
                //                 let idUserCampaign: number = fileRows[i].idQueue;
                //                 await this.customerModel.assignCustomerCampaign(customerId, fileRows[i].idCampaign, idUserCampaign, conn);
                //                 const ok = await this.customerModel.updateCustomerQueue(fileRows[i].idQueue, customerId, conn);
                //                 if (!ok) {
                //                     await this.customerModel.addCustomerQueue(fileRows[i].idQueue, customerId, conn);
                //                 }
                //                 await conn.query("COMMIT");
                //                 countOK++;
                //             } catch (err) {
                //                 await conn.query('ROLLBACK');
                //                 await this.customerModel.errorLogMassive(idLog, `Error al asignar el cliente ${fileRows[i].ci}, id ${customerId}`, conn);
                //                 console.error(`Error al asignar el cliente ${fileRows[i].ci}, id ${customerId}`, err);
                //                 countError++;
                //             }
                //         }

                //         await this.customerModel.logMassiveUpdateEnd(idLog, countOK, countError, conn);
                //         fs.unlinkSync(req.file.path);   // remove temp file
                //         //process "fileRows" and respond
                //         const logData = await this.customerModel.logMassiveData(idLog, conn);
                //         httpRes.send({ message: "Termino la importacion", data: logData });
                //     });
            } catch (err) {
                console.error(err);
            }
        });
    }


}