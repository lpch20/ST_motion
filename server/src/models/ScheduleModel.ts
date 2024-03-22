import { ResultWithData, ResultCode } from '../../../datatypes/result';
import { VSchedule } from '../../../datatypes/viewDataType/VSchedule';
import { MainModel } from './mainModel';
var moment = require('moment');

export class ScheduleModel extends MainModel {
    constructor() {
        super();
    }

    // not used
    // getAll(shcedule: VSchedule, dbName: string, callBack: (r: ResultWithData<VSchedule[]>) => void): void {
    //     var pool = this.controllerConnections.getUserConnection(dbName);
    //     var mainThis = this;
    //     pool.getConnection(function (err: any, con: any) {
    //         if (!!err) {
    //             mainThis.errorModel(con, err, callBack);
    //         } else {
    //             let QUERY: string = 'SELECT * FROM schedule';
    //             con.query(QUERY, (err: any, result: any[]) => {
    //                 if (!!err) {
    //                     mainThis.errorModel(con, err, callBack);
    //                 } else {
    //                     con.release();
    //                     callBack({
    //                         result: ResultCode.OK,
    //                         message: 'OK',
    //                         data: result
    //                     });
    //                 }
    //             });
    //         }
    //     });
    // }

    /**
     * @param idUser 
     * @param con 
     * @param callBack 
     */
    getScheduleDayByUser(idUser: number, con: any, callBack: (r: ResultWithData<VSchedule[]>) => void): void {
        let dateFrom: Date = new Date();
        dateFrom.setHours(0);
        dateFrom.setMinutes(0);
        let dateTo: Date = new Date();
        dateTo.setHours(23);
        dateTo.setMinutes(59);

        let QUERY = `SELECT s.*, names as namesCustomer, lastnames as lastnamesCustomer
        FROM schedule s
        INNER JOIN customer c ON c.id = s.idCustomer 
        WHERE idUser = ? AND s.date BETWEEN ? AND ? 
        ORDER BY s.date ASC`;
        let values = [idUser, dateFrom, dateTo];
        con.query(QUERY, values, (err: any, result: any[]) => {
            if (!!err) {
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

    /**
     * @param idUser 
     * @param con
     * @param callBack 
     */
    getAllByUser(idUser: number, con: any, callBack: (r: ResultWithData<VSchedule[]>) => void): void {
        let QUERY: string = `SELECT s.*, names as namesCustomer, lastnames as lastnamesCustomer
                            FROM schedule s
                            INNER JOIN customer c ON c.id = s.idCustomer 
                            WHERE idUser = ? 
                            ORDER BY s.date ASC`;
        con.query(QUERY, [idUser], (err: any, result: any[]) => {
            if (!!err) {
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

    getAllByUserByDate(idUser: number, dateFrom: Date, dateTo: Date, con: any, callBack: (r: ResultWithData<VSchedule[]>) => void): void {
        let params: any[] = [dateFrom, dateTo];
        let QUERY: string = `SELECT s.*, names as namesCustomer, lastnames as lastnamesCustomer,ci
                                    FROM schedule s
                                    INNER JOIN customer c ON c.id = s.idCustomer
                                    WHERE s.date BETWEEN ? AND ? `;
        if (idUser !== 0) {
            QUERY += ' AND idUser = ?';
            params.push(idUser);
        }
        QUERY += ' ORDER BY s.date ASC';

        con.query(QUERY, params, (err: any, result: any[]) => {
            if (!!err) {
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

    updateScheduleResolve(idSchedule: number, resolved: boolean, con: any, callBack: (r: ResultWithData<VSchedule[]>) => void): void {
        let QUERY = `UPDATE schedule SET active = ? WHERE id = ? `;
        con.query(QUERY, [resolved, idSchedule], (err: any, result: any[]) => {
            if (!!err) {
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

    add(shcedule: VSchedule, con: any, callBack: (r: ResultWithData<VSchedule[]>) => void): void {
        var stillUtc = moment.utc(shcedule.date).toDate();
        var localDate = moment(stillUtc).local().format('YYYY-MM-DD HH:mm:ss');

        let QUERY = 'INSERT INTO schedule(idUser,idCustomer,date,phoneNumber,subject,active) VALUES(?,?,?,?,?,?)';
        let values = [shcedule.idUser, shcedule.idCustomer, localDate, shcedule.phoneNumber, shcedule.subject, shcedule.active];
        con.query(QUERY, values, (err: any, result: any[]) => {
            if (!!err) {
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
}
