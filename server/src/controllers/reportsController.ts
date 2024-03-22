import * as express from 'express';
// import csv from 'fast-csv';
// import fs from 'fs';
import moment from 'moment';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { ReportsModel } from '../models/reportsModel';
import { IPromiseConnection, MainController } from './mainController';

export class ReportsController extends MainController {

    private resource: string;
    private reportsModel: ReportsModel;

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        //TODO Cambiar
        this.resource = "users";
        this.reportsModel = new ReportsModel();
    }

    public customerByCampaigns = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                if (req.body.idUser && req.body.idUser > 0) {
                    this.reportsModel.customerByCampaignsByUser(req.body.idUser, con, (result: any) => {
                        res.send(result);
                    });
                } else {
                    this.reportsModel.customerByCampaigns(con, (result: any) => {
                        res.send(result);
                    });
                }
            });
        });
    };

    public callsByAgent = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                this.reportsModel.callsByAgent(req.body.campaignId, new Date(req.body.from), new Date(req.body.to), con, (result: any) => {
                    res.send(result);
                });
            });
        });
    };

    public lastEventForAll = (req: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(req, httpRes, this.resource, async (dbName: string) => {
            let d = new Date();
            d.setMinutes(d.getMinutes() + 1);

            // var j = schedule.scheduleJob(d, function () {

            const currDate = moment(new Date()).format('DD/MM/YYYY');
            const subject = `Requiro - Reporte de ultimo evento - ${currDate}`;
            const mailTo = 'news-it@dlab.com.uy';

            let text = `Prueba`;

            const isHtml = true;

            let conn: IPromiseConnection;

            conn = await this.getConnectionWithPromise(dbName);
            const report = await this.reportsModel.lastEventForAll(conn);

            const pathCsv = __dirname + '/../../../tmp/csv/ej.csv';

            // let ws = fs.createWriteStream(pathCsv);

            // let csv_array: any[] = new Array();

            // report.forEach((item: { lastDate: any; agent: any; campaign: any; ci: any; result: any; phone: any; }) => {
            //     const d = new Date(item.lastDate);
            //     const aux: any[] = new Array();
            //     aux.push(item.agent);
            //     aux.push(item.campaign);
            //     aux.push(item.ci);
            //     aux.push(d.getDate() + '/' + (d.getMonth() + 1) + '/' + d.getFullYear());
            //     aux.push(item.result);
            //     aux.push(item.phone);
            //     csv_array.push(aux);
            // });

            // var fast_csv = csv.write(csv_array, { headers: true }).pipe(ws);
            // var attachments = [{ filename: 'reporte.csv', path: pathCsv }];


            // motionMail.sendMail(subject, `<html><body><table>${text}</table></body></html>`, isHtml, mailTo, attachments,
            //     (r: string) => {
            //         console.log(r)

            //     },
            //     (e: string) => {
            //         console.error(e);

            //     });


            httpRes.send({ message: "Se le enviara un correo electronico en breve con la informacion solicitada", data: new Date() });

            // let conn: IPromiseConnection;
            // try {
            //     conn = await this.getConnectionWithPromise(dbName);
            //     const report = await this.reportsModel.lastEventForAll(conn);
            //     httpRes.send({ data: report });
            // } catch (err) {
            //     console.error(err);
            // }
        });
    }


    public deleteOldCustomerCampaigns = (req: express.Request, httpRes: express.Response): void => {
        this.verifyAccess(req, httpRes, this.resource, async (dbName: string) => {
            let conn: IPromiseConnection;
            conn = await this.getConnectionWithPromise(dbName);

            // this.getPool(dbName, async (conn) => {



            try {
                const ids: any[] = await this.reportsModel.oldCustomerCampaign(conn);

                const chunk = 1000;

                while (ids.length > 0) {
                    let ids1 = ids.splice(0, chunk);
                    await this.reportsModel.deleteOldCustomerCampaigns(ids1, conn);
                }

                httpRes.send({ message: "Se limpio excedente de customer campaign", data: new Date() });
            } catch (err) {
                httpRes.send({ message: "Error", data: new Date() });
            }

            // });

        });
    }
}
