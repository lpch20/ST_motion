import { ResultWithData, ResultCode } from '../../../datatypes/result';
import { Break } from '../../../datatypes/Break';
import { MainModel } from './mainModel';
import { IQueryableConnection } from '../controllers/mainController';
var moment = require('moment');

export class BreakModel extends MainModel {

    constructor() {
        super();
    }

    getAll(con: IQueryableConnection, callBack: (r: ResultWithData<Break[]>) => void): void {
        const QUERY: string = 'SELECT * FROM breaks';
        con.query(QUERY, (err: any, result: any[]) => {
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

    getBreakByUser(idUser: number, con: IQueryableConnection, callBack: (r: ResultWithData<Break[]>) => void): void {
        const QUERY: string = 'SELECT * FROM breaks WHERE idUser = ?';
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

    getLastByCurrentUser(idUser: number, con: IQueryableConnection, callBack: (r: any) => void): void {
        const QUERY: string = 'SELECT * FROM breaks WHERE idUser = ? ORDER BY date DESC LIMIT 1';
        con.query(QUERY, [idUser], (err: any, result: any[]) => {
            if (!!err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result,
                    serverTime : moment()
                });
            }
        });
    }

    getLastBreaks(con: IQueryableConnection, callBack: (r: ResultWithData<Break[]>) => void): void {
        let QUERY: string = 'select id, t.idUser, t.date, t.init, t.idTypeBreak from breaks t inner join';
        QUERY += '( select idUser, max(date) as date from breaks group by idUser) tm on t.idUser = tm.idUser and t.date = tm.date';
        con.query(QUERY, (err: any, result: any[]) => {
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

    getBreakByUserByDate(idUser: number, dateFrom: Date, dateTo: Date, con: IQueryableConnection, callBack: (r: ResultWithData<Break[]>) => void): void {
        let params: any[] = [dateFrom, dateTo];
        let QUERY: string = 'SELECT * FROM breaks WHERE date BETWEEN ? AND ? ';
        if (idUser && idUser !== 0) {
            QUERY += ' AND idUser = ?';
            params.push(idUser);
        }
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

    add(idUser: number, breakTime: Break, con: IQueryableConnection, callBack: (r: ResultWithData<Break[]>) => void): void {
        const QUERY: string = 'INSERT INTO breaks(idUser,idTypeBreak,date,init) VALUES(?,?,NOW(),?)';
        con.query(QUERY, [idUser, breakTime.idTypeBreak, breakTime.init], (err: any, result: any[]) => {
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
