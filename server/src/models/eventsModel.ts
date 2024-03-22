import { EventType } from '../../../datatypes/eventType';
import { ResultCode, ResultWithData } from '../../../datatypes/result';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { MainModel } from './mainModel';

export class EventsModel extends MainModel {
    constructor(private controllerConnections: ControllerDBClientsConnections) {
        super();
    }

    getEventsByCustomer(idCustomer: number, connection: any, callBack: (r: ResultWithData<EventType[]>) => void): void {
        let mainThis = this;
        const QUERY: string = 'SELECT * FROM customer_events WHERE idCustomer = ? ORDER BY date DESC';
        connection.query(QUERY, [idCustomer], function (err: any, result: EventType[]) {
            if (!!err) {
                mainThis.errorModel(connection, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result
                });
            }
        });
    }

    getEventsByUser(iduser: number, dbName: string, callBack: (r: ResultWithData<EventType[]>) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        var mainThis = this;
        pool.getConnection(function (err: any, con: any) {
            if (!!err) {
                mainThis.errorModel(con, err, callBack);
            } else {
                const QUERY: string = 'SELECT * FROM customer_events ce INNER JOIN customer c ON ce.idCustomer = c.id  WHERE idUser = ?';
                con.query(QUERY, [iduser], function (err: any, result: EventType[]) {
                    if (!!err) {
                        mainThis.errorModel(con, err, callBack);
                    } else {
                        con.release();
                        callBack({
                            result: ResultCode.OK,
                            message: 'OK',
                            data: result
                        });
                    }
                });
            }
        });
    }

    getEventByUserByDate(iduser: number, dateFrom: Date, dateTo: Date, con: any, callBack: (r: ResultWithData<any[]>) => void): void {
        let params: any[] = [dateFrom, dateTo];
        let QUERY = `   SELECT ce.*, c.names, c.lastnames, c.ci, c.address, c.idDepartment, c.idCity, cd.portfolio, a.name as action
                        FROM customer_events ce
                        INNER JOIN customer c ON c.id = IdCustomer                        
                        INNER JOIN customer_debt cd ON ce.idCustomer = cd.idCustomer
                        LEFT JOIN action a ON ce.idAction = a.id
                        WHERE ce.date BETWEEN ? AND ? `;

        if (iduser !== 0) {
            QUERY += ' AND idUser = ?';
            params.push(iduser);
        }

        QUERY += ' group by ce.date, ce.idCustomer';

        con.query(QUERY, params, (err: any, result: any[]) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result
                });
            }
        });
    }

    getEventCountTypeByUser(iduser: number, dateFrom: Date, dateTo: Date, con: any, callBack: (r: ResultWithData<EventType[]>) => void): void {
        var mainThis = this;
        let params: any[] = [dateFrom, dateTo];
        let QUERY: string = 'SELECT eventType, count(*) AS occurrences  FROM `customer_events` ';
        QUERY += ' WHERE date BETWEEN ? AND ?';
        if (iduser !== 0) {
            QUERY += ' AND idUser = ?';
            params.push(iduser);
        }
        QUERY += ' GROUP BY eventType ';
        con.query(QUERY, params, function (err: any, result: EventType[]) {
            if (!!err) {
                mainThis.errorModel(con, err, callBack);
            } else {
                callBack({ result: ResultCode.OK, message: 'OK', data: result });
            }
        });
    }



}