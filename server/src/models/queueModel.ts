import { ResultCode, ResultWithData } from '../../../datatypes/result';
import { IQueryableConnection, IQueryablePromiseConnection } from '../controllers/mainController';
import { MainModel, SqlError } from './mainModel';


export class QueueModel extends MainModel {

    constructor() {
        super();
    }

    getAll(connection: IQueryableConnection, callBack: (r: ResultWithData<any>) => void): void {
        let mainThis = this;
        let query: string = "SELECT * FROM queue";
        connection.query(query,
            function (err: any, resultQuery: any) {
                if (!!err) {
                    mainThis.errorModel(connection, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: '', data: resultQuery });
                }
            });
    }

    /**
     * Obtiene la relacion queue-user por id de usuario
     */
    getQueueByUser(idUser: number, conn: any, callBack: (r: ResultWithData<any>) => void): void {
        const QUERY = "SELECT * FROM queue_user WHERE idUser = ?";
        conn.query(QUERY, [idUser], (err: any, resultQuery: any) => {
            if (err) {
                this.errorModel(conn, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: resultQuery
                });
            }
        });
    }

    existsAssignCustomerQueue(idQueue: number, idCustomer: number, connection: IQueryableConnection, callBack: (r: ResultWithData<boolean>) => void): void {
        let query: string = "SELECT * FROM item_queue WHERE idQueue = ? AND idCustomer = ?";
        connection.query(query, [idQueue, idCustomer], (err: any, resultQuery: any) => {
            if (!!err) {
                this.errorModel(connection, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: '',
                    data: resultQuery && resultQuery.length > 0
                });
            }
        });
    }

    assignCustomerQueue(idQueue: number, idCustomer: number, itemOrder: number, connection: IQueryableConnection, callBack: (r: ResultWithData<any>) => void): void {
        let mainThis = this;
        let query: string = "INSERT INTO item_queue(idQueue,idCustomer,itemOrder,status) VALUES(?,?,?,'withoutCalling')";
        connection.query(query, [idQueue, idCustomer, itemOrder],
            function (err: any, resultQuery: any) {
                if (!!err) {
                    mainThis.errorModel(connection, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: '', data: resultQuery });
                }
            });
    }

    updateCustomerQueue(idQueueSource: number, idQueue: number, idCustomer: number, itemOrder: number, connection: IQueryableConnection, callBack: (r: ResultWithData<any>) => void): void {
        let mainThis = this;
        let query: string = "UPDATE item_queue SET  idQueue = ? ,idCustomer = ?,itemOrder =? WHERE idCustomer = ? AND idQueue = ?";
        let queryPerformed = connection.query(query, [idQueue, idCustomer, itemOrder, idCustomer, idQueueSource],
            function (err: any, resultQuery: any) {
                if (!!err) {
                    mainThis.errorModel(connection, err, callBack);
                } else {
                    console.log(queryPerformed.sql);
                    callBack({ result: ResultCode.OK, message: '', data: resultQuery });
                }
            });
    }

    getLastOrderCustomerQueue(idQueue: number, connection: IQueryableConnection, callBack: (r: ResultWithData<any>) => void): void {
        let mainThis = this;
        let query: string = "SELECT itemOrder FROM item_queue WHERE idQueue = ? ORDER BY itemOrder DESC LIMIT 1";
        connection.query(query, [idQueue],
            function (err: any, resultQuery: any) {
                if (!!err) {
                    mainThis.errorModel(connection, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: '', data: resultQuery });
                }
            });
    }

    getCustomersByQueue(idQueue: number, ci: string, idCampaign: number, connection: IQueryableConnection, callBack: (r: ResultWithData<any>) => void): void {
        let query: string = "";
        let parameters: any[] = [idQueue];
        let ciQuery = "";
        if (ci !== "-") {
            ciQuery = " AND ci LIKE ? ";
            parameters.push('%' + ci + '%');

        }
        if (idCampaign && idCampaign > 0) {
            query = `   SELECT c.id AS id,ci,names,lastnames
                        FROM item_queue iq
                        INNER JOIN customer c ON iq.idCustomer = c.id 
                        INNER JOIN customer_campaign cc ON cc.idCustomer = c.id
                        WHERE idQueue = ? ${ciQuery}
                                AND idCampaign = ?
                                AND cc.id IN (  SELECT cc.id
                                                FROM customer_campaign cc
                                                INNER JOIN (SELECT idCustomer, MAX(date) AS Maxdate
                                                            FROM customer_campaign
                                                            GROUP BY idCustomer) maxCC 
                                                ON cc.idCustomer = maxCC.idCustomer 
                                                AND cc.date = maxCC.Maxdate
                                            )
                        ORDER BY itemOrder ASC, assignDate DESC`;

            parameters.push(idCampaign);
        } else {
            query = `SELECT idCustomer AS id,ci,names,lastnames
                             FROM item_queue iq
                             INNER JOIN customer c ON iq.idCustomer = c.id 
                             WHERE idQueue = ? ${ciQuery}
                             ORDER BY itemOrder ASC, assignDate DESC`;
        }

        connection.query(query, parameters,
            (err: any, resultQuery: any) => {
                if (!!err) {
                    this.errorModel(connection, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: '', data: resultQuery });
                }
            });
    }

    public async getUsersByQueue(idQueue: number, conn: IQueryablePromiseConnection): Promise<any> {

        let query: string = `SELECT u.id, firstname, lastname FROM users u 
                                INNER JOIN queue_user qu ON u.id = qu.idUser 
                                WHERE idQueue = ? GROUP BY u.id, firstname, lastname`;
        return conn.query(query, [idQueue])
            .catch((reason: SqlError) => this.errorHandlerWithPromise(conn, reason));
    }

    public async assignUserToQueue(idQueue: number, idUser: number, conn: IQueryablePromiseConnection): Promise<any> {
        let query: string = `update queue_user SET idQueue = ?
                                    WHERE idUser = ?`;

        const updateResult = conn.query(query, [idQueue, idUser]);
        return updateResult.then(
            result => {
                return Promise.resolve(result.affectedRows === 1)
            }
        ).catch(
            (reason: SqlError) =>
                this.errorHandlerWithPromise(conn, reason));
    }

    // public async assignCustomerFromCampaignToQueue(idQueue: number, idCampaign: number, conn: IQueryablePromiseConnection): Promise<any> {
    //     let query: string = `update item_queue SET idQueue = ?
    //                                 WHERE idCustomer IN (
    //                                     SELECT c1.idCustomer
    //                                         FROM customer_campaign c1 
    //                                         WHERE c1.idCampaign = ?
    //                                         and NOT EXISTS 	(SELECT idCustomer 
    //                                                         FROM customer_campaign c2 
    //                                                         WHERE c1.idCustomer = c2.idCustomer
    //                                                         and c2.idCampaign = ?
    //                                                         AND c1.date < c2.date)
    //                                     )`;
    //     return conn.query(query, [idQueue, idCampaign, idCampaign])
    //         .catch((reason: SqlError) => this.errorHandlerWithPromise(conn, reason));
    // }

    public async assignCustomerFromCampaignToQueue(idQueue: number, idCampaign: number, conn: IQueryablePromiseConnection): Promise<any> {
        let query: string = `update item_queue SET idQueue = ?
                                        WHERE idCustomer IN (
                                            SELECT c.id
                                            FROM customer_campaign c1 inner join 
                                            customer c on c.id = c1.idCustomer
                                            WHERE  c1.idCampaign = ?
                                            and NOT EXISTS 	(SELECT idCustomer 
                                                            FROM customer_campaign c2 
                                                            WHERE c1.idCustomer = c2.idCustomer
                                                            AND c1.date < c2.date)
                                            )`;
        return conn.query(query, [idQueue, idCampaign])
            .catch((reason: SqlError) => this.errorHandlerWithPromise(conn, reason));
    }



    public async getCampaignsByQueue(idQueue: number, conn: IQueryablePromiseConnection): Promise<any> {
        // let query: string = `SELECT * FROM campaign WHERE id IN (
        //                                                     select idCampaign FROM customer_campaign c 
        //                                                         INNER JOIN item_queue iq ON c.idCustomer = iq.idCustomer  
        //                                                         WHERE idQueue = ? )`;


        let query: string = `SELECT c1.idCampaign,ca.name
                                FROM campaign ca 
                                JOIN customer_campaign c1 on ca.id = c1.idCampaign
                                JOIN customer cus on cus.id = c1.idCustomer
                                JOIN item_queue iq ON c1.idCustomer = iq.idCustomer
                                WHERE iq.idQueue = ?
                                and cus.isActive = 1
                                and NOT EXISTS 	(SELECT idCampaign 
                                                FROM customer_campaign c2 
                                                WHERE c1.idCustomer = c2.idCustomer
                                                AND c1.date < c2.date)
                                 GROUP BY idCampaign, name`;

        // let query: string = `SELECT c1.idCampaign,ca.name 
        //                         FROM campaign ca 
        //                         JOIN customer_campaign c1 on ca.id = c1.idCampaign
        //                         JOIN item_queue iq ON c1.idCustomer = iq.idCustomer
        //                         WHERE iq.idQueue = ?
        //                         and NOT EXISTS 	(SELECT idCampaign 
        //                                         FROM customer_campaign c2 
        //                                         WHERE c1.idCustomer = c2.idCustomer
        //                                         AND c1.date < c2.date)
        //                         GROUP BY idCampaign, name` ;
        return conn.query(query, [idQueue])
            .catch((reason: SqlError) => this.errorHandlerWithPromise(conn, reason));
    }

}