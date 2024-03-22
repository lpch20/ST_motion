import { Customer } from '../../../datatypes/Customer';
import { ResultCode, ResultWithData } from '../../../datatypes/result';
import { Engagement } from '../../../datatypes/viewDataType/engagement';
import { MainModel } from './mainModel';

export class EngagementModel extends MainModel {
    constructor() {
        super();
    }

    add(engagement: Engagement, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        let QUERY: string = `INSERT INTO engagement(idEvent,paymentPromiseDate,numberOfFees,amountFees,agreedDebt,initialDelivery,idBranchOffice)
                            VALUES(?,?,?,?,?,?,?)`;
        let values = [engagement.idEvent, super.formatDateTimeSql(engagement.paymentPromiseDate), engagement.numberOfFees, engagement.amountFees,
        engagement.agreedDebt, engagement.initialDelivery, engagement.idBranchOffice]
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

    getEngagementByAgentByDate(idAgent: number, dateFrom: Date, dateTo: Date, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        var mainThis = this;
        let QUERY: string = 'SELECT * FROM customer_events ce INNER JOIN engagement e ON ce.id = e.idEvent WHERE ce.idUser = ? AND ce.date BETWEEN ? AND ?';
        con.query(QUERY, [idAgent, dateFrom, dateTo], function (err: any, result: any[]) {
            if (!!err) {
                mainThis.errorModel(con, err, callBack);
            } else {
                callBack({ result: ResultCode.OK, message: 'OK', data: result });
            }
        });
    }

    getEngagementByDate(dateFrom: Date, dateTo: Date, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        var mainThis = this;
        let QUERY: string = 'SELECT * FROM customer_events ce INNER JOIN engagement e ON ce.id = e.idEvent WHERE ce.date BETWEEN ? AND ? ORDER BY ce.date DESC';
        con.query(QUERY, [dateFrom, dateTo], function (err: any, result: any[]) {
            if (!!err) {
                mainThis.errorModel(con, err, callBack);
            } else {
                callBack({ result: ResultCode.OK, message: 'OK', data: result });
            }
        });
    }

    getEngagementsByCustomer(idCustomer: number, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        var mainThis = this;
        let QUERY: string = 'SELECT e.*,ce.*,c.names,c.lastnames, c.ci FROM customer_events ce INNER JOIN engagement e ON ce.id = e.idEvent ';
        QUERY += ' INNER JOIN customer c ON ce.idCustomer = c.id WHERE ce.idCustomer = ? ORDER BY ce.date DESC';
        con.query(QUERY, [idCustomer], function (err: any, result: any[]) {
            if (!!err) {
                mainThis.errorModel(con, err, callBack);
            } else {
                callBack({ result: ResultCode.OK, message: 'OK', data: result });
            }
        });
    }

    getCustomersByDateFromEngagements(dateFrom: Date, dateTo: Date, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        let QUERY: string = `SELECT DISTINCT ce.idCustomer
                            FROM customer_events ce
                            INNER JOIN engagement e ON ce.id = e.idEvent  
                            WHERE ce.date BETWEEN ? AND ?
                            ORDER BY ce.date DESC`;
        con.query(QUERY, [dateFrom, dateTo], (err: any, result: any[]) => {
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

    getCustomersByUserByDateFromEngagements(userId: number, dateFrom: Date, dateTo: Date, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        let QUERY: string = `SELECT DISTINCT ce.idCustomer
                            FROM customer_events ce
                            INNER JOIN engagement e ON ce.id = e.idEvent  
                            WHERE ce.date BETWEEN ? AND ? AND ce.idUser = ?
                            ORDER BY ce.date DESC`;
        con.query(QUERY, [dateFrom, dateTo, userId], (err: any, result: any[]) => {
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

    getEngagementByCustomerByDate(idCustomer: number, dateFrom: Date, dateTo: Date, con: any, callBack: (r: ResultWithData<any[]>) => void): void {
        var mainThis = this;
        let QUERY: string = 'SELECT * FROM customer_events ce INNER JOIN engagement e ON ce.id = e.idEvent ';
        QUERY += ' INNER JOIN customer c ON ce.idCustomer = c.id WHERE ce.idCustomer = ? AND ce.date BETWEEN ? AND ? ORDER BY ce.date DESC';
        let queryPerformed = con.query(QUERY, [idCustomer, dateFrom, dateTo], function (err: any, result: any[]) {
            if (!!err) {
                mainThis.errorModel(con, err, callBack);
            } else {
                console.log(queryPerformed.sql);
                callBack({ result: ResultCode.OK, message: 'OK', data: result });
            }
        });
    }

    getAll(con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        var mainThis = this;
        const QUERY: string = 'SELECT * FROM break_type';
        con.query(QUERY, function (err: any, result: any[]) {
            if (!!err) {
                mainThis.errorModel(con, err, callBack);
            } else {
                callBack({ result: ResultCode.OK, message: 'OK', data: result });
            }
        });
    }
}