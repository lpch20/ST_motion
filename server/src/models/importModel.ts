import { LogImport } from '../../../datatypes/LogImport';
import { Result, ResultCode, ResultError, ResultWithData } from '../../../datatypes/result';
import { IQueryableConnection } from '../controllers/mainController';
import { MainModel } from './mainModel';
var SqlString = require('sqlstring');

export class ImportModel extends MainModel {
    constructor() {
        super();
    }

    public beginImport(entity: Entity, con: IQueryableConnection, callback: (err: ResultError | null, res: any) => void): void {
        const isSuccess = null;
        const errorMessage = null;
        this.insertEvent(entity, Event.Begin, isSuccess, errorMessage, con, callback);
    }

    public endSuccessImport(id: number, information: string | null, con: IQueryableConnection, callback: (err: ResultError | null, res: any) => void): void {
        const isSuccess = true;
        const errorMessage = null;
        this.updateEndEvent(id, Event.End, isSuccess, errorMessage, information, con, callback)
    }

    public endErrorImport(id: number, error: Result, con: IQueryableConnection, callback: (err: ResultError | null, res: any) => void): void {
        const isSuccess = false;
        this.updateEndEvent(id, Event.End, isSuccess, SqlString.escape(JSON.stringify(error)), '', con, callback)
    }

    /**
     * Obtiene un resumen de las importaciones del ultimo dia
     */
    public getLastBatchImportResult(conn: IQueryableConnection, callback: (r: ResultWithData<LogImport[]>) => void): void {
        const SELECT_RESULT = ` SELECT *
                                FROM log_import li
                                WHERE li.startDate > DATE_SUB(NOW(), INTERVAL 12 HOUR) 
                                ORDER BY li.startDate`;
        conn.query(SELECT_RESULT, (err: any, res: any[]) => {
            if (err) {
                this.errorModel(conn, err, callback);
            } else {
                callback({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: res && res.length > 0 ? res : []
                });
            }
        });
    }

    private insertEvent(entity: Entity, event: Event, isSuccess: boolean | null, errorMessage: string | null,
        con: IQueryableConnection, callback: (err: ResultError | null, res: any) => void): void {
        const INSERT_LOG: string = `INSERT INTO log_import (entity, event, isSuccess, errorMessage)
                                      VALUES(?,?,?,?)`;
        const VALUES = [entity, event, isSuccess, errorMessage];
        con.query(INSERT_LOG, VALUES, (err: any, res: any[]) => {
            if (err) {
                this.errorModel(con, err, (r) => {
                    callback(<ResultError>r, null);
                })
                callback(err, null);
            } else {
                callback(null, res);
            }
        });
    }

    private updateEndEvent(import_id: number, event: Event, isSuccess: boolean | null, errorMessage: string | null, information: string | null,
        con: IQueryableConnection, callback: (err: ResultError | null, res: any) => void): void {
        const UPDATE_LOG: string = `UPDATE log_import  
                                    SET event = ? ,isSuccess = ? ,errorMessage = ? ,information = ?, endDate = NOW()
                                      WHERE id = ?`;
        const VALUES = [event, isSuccess, errorMessage, information, import_id];
        con.query(UPDATE_LOG, VALUES, (err: any, res: any[]) => {
            if (err) {
                this.errorModel(con, err, (r) => {
                    callback(<ResultError>r, null);
                })
                callback(err, null);
            } else {
                callback(null, res);
            }
        });
    }
}

export enum Entity {
    AllCustomer = 'allCustomer',
    Customer = 'customer',
    Debt = 'debt',
    Payment = 'payment',
    Agreements = 'agreement',
    CampaignAssignment = 'campaignAssignment'
}

enum Event {
    Begin = 'begin',
    End = 'end'
}