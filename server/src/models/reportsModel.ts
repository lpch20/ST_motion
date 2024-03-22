import { Report } from '../../../datatypes/report';
import { ReportCall } from '../../../datatypes/reports/call';
import { ResultCode, ResultWithData } from '../../../datatypes/result';
import { IQueryablePromiseConnection } from '../controllers/mainController';
import { MainModel } from './mainModel';

export class ReportsModel extends MainModel {

    constructor() {
        super();
    }

    customerByCampaigns(con: any, callBack: (r: ResultWithData<Report<number>[]>) => void): void {
        const QUERY: string = ` SELECT customer_campaign.idCampaign, COUNT(*) as count
                                FROM  item_queue
                                INNER JOIN customer_campaign ON item_queue.idCustomer = customer_campaign.idCustomer
                                WHERE customer_campaign.id IN ( SELECT cc.id
                                                                FROM customer_campaign cc
                                                                INNER JOIN (SELECT idCustomer, MAX(date) AS Maxdate
                                                                            FROM customer_campaign
                                                                            GROUP BY idCustomer) maxCC 
                                                                ON cc.idCustomer = maxCC.idCustomer 
                                                                AND cc.date = maxCC.Maxdate
                                                                )
                                GROUP BY customer_campaign.idCampaign`;
        con.query(QUERY, (err: any, result: { idCampaign: number, count: number }[]) => {
            if (!!err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result.map(r => <Report<number>>{ count: r.count, data: r.idCampaign })
                });
            }
        });
    }

    customerByCampaignsByUser(idUser: number, con: any, callBack: (r: ResultWithData<Report<number>[]>) => void): void {
        const QUERY = ` SELECT customer_campaign.idCampaign, COUNT(*) as count
                        FROM item_queue
                        INNER JOIN queue_user ON queue_user.idQueue = item_queue.idQueue 
                        INNER JOIN customer_campaign ON item_queue.idCustomer = customer_campaign.idCustomer
                        WHERE queue_user.idUser = ? AND
                            customer_campaign.id IN (   SELECT cc.id
                                                        FROM customer_campaign cc
                                                        INNER JOIN (SELECT idCustomer, MAX(date) AS Maxdate
                                                                    FROM customer_campaign
                                                                    GROUP BY idCustomer) maxCC 
                                                        ON cc.idCustomer = maxCC.idCustomer 
                                                        AND cc.date = maxCC.Maxdate
                                                    )
                        GROUP BY customer_campaign.idCampaign`
        con.query(QUERY, [idUser], (err: any, result: { idCampaign: number, count: number }[]) => {
            if (!!err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result.map(r => <Report<number>>{ count: r.count, data: r.idCampaign })
                });
            }
        });
    }

    callsByAgent(campaignId: number, from: Date, to: Date, con: any, callback: (r: ResultWithData<ReportCall[]>) => void): void {
        let QUERY: string = campaignId && campaignId > 0 ? `
            SELECT ce.idUser, COUNT(DISTINCT(ce.idCustomer)) as countByCustomer, COUNT(*) as count 
            FROM customer_events ce
            INNER JOIN customer_campaign cc ON ce.idCustomer = cc.idCustomer 
            WHERE cc.id IN (SELECT t1.id
                        FROM customer_campaign t1
                        WHERE t1.date = (SELECT MAX(t2.date)
                                        FROM customer_campaign t2
                                        WHERE t2.idCustomer = t1.idCustomer)) 
                AND ce.date BETWEEN ? AND ?
                AND cc.idCampaign = ?
            GROUP BY ce.idUser`:
            `SELECT ce.idUser, count(distinct(ce.idCustomer)) as countByCustomer, count(*) as count 
            FROM customer_events ce
            WHERE ce.date BETWEEN ? AND ?
            GROUP BY ce.idUser;`;

        con.query(QUERY, [from, to, campaignId], super.errorHandlerGeneric<ReportCall[]>(con, callback, (callsReport) => {
            callback({
                result: ResultCode.OK,
                message: 'OK',
                data: callsReport
            });
        }));
    }

    /**
     * 
     * @param idCustomer 
     * @param idCampaign 
     * @param idUser 
     * @param conn 
     */
    public async logMassiveData(idLog: number, conn: IQueryablePromiseConnection): Promise<any> {
        const queryCampaign = "SELECT * FROM log_massive_update WHERE id = ?";

        try {
            const results = await conn.query(queryCampaign, [idLog]);
            return results && results.length > 0 ? results[0] : undefined;
        } catch (reason) {
            await this.errorHandlerWithPromise(conn, reason);
            return Promise.reject(reason);
        }
    }

    public async lastEventForAll(conn: IQueryablePromiseConnection): Promise<any> {
        const queryLastEvent = `select  c.id as idCustomer,c.ci as ci,e.name as result,ce.phone as phone, 
            ce.date as lastDate, cam.name as campaign, ce.idUser as agent
            from customer c
            join customer_events ce on ce.idCustomer = c.id
            join event_type e on ce.eventType = e.id
            join customer_campaign cc on cc.idCustomer = ce.idCustomer
            join campaign cam on cam.id = cc.idCampaign
            where c.isActive = 1
            and not exists (select * from customer_events ce2 
                    where ce.idCustomer = ce2.idCustomer 
                    and ce.phone = ce2.phone
                    and ce.modified < ce2.modified )
            and not exists (select * from customer_campaign cc2 
                    where cc.idCustomer = cc2.idCustomer 
                    and cc.modified < cc2.modified )
            group by c.id,c.ci,e.name, ce.phone,ce.date, cam.name, ce.idUser`;

        try {
            const results = await conn.query(queryLastEvent);
            return results && results.length > 0 ? results : undefined;
        } catch (reason) {
            await this.errorHandlerWithPromise(conn, reason);
            return Promise.reject(reason);
        }
    }

    public async oldCustomerCampaign(conn: IQueryablePromiseConnection): Promise<any> {
        const queryLastEvent = `
                        select c.id from customer_campaign c
                        where c.id not in (
                            SELECT DISTINCT c1.id FROM customer_campaign c1
                            WHERE NOT EXISTS (SELECT * FROM customer_campaign c2 WHERE c1.idCustomer = c2.idCustomer AND c2.id > c1.id) 
                        )`;

        try {
            const results = await conn.query(queryLastEvent);
            return results && results.length > 0 ? results.map((c: { id: number; }) => {
                return c.id;
            }) : undefined;
        } catch (reason) {
            await this.errorHandlerWithPromise(conn, reason);
            return Promise.reject(reason);
        }
    }

    public async deleteOldCustomerCampaigns(ids: number[], conn: IQueryablePromiseConnection): Promise<any> {
        console.log(ids);
        const queryLastEvent = `DELETE FROM customer_campaign WHERE id IN (?)`;
        try {
            const results = await conn.query(queryLastEvent, [ids]);
            return results && results.length > 0 ? results : undefined;
        } catch (reason) {
            await this.errorHandlerWithPromise(conn, reason);
            return Promise.reject(reason);
        }
    }


}
