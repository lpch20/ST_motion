
import { Result, ResultCode, ResultError, ResultWithData } from '../../../datatypes/result';
var SqlString = require('sqlstring');
var moment = require('moment');

export class MainModel {
    constructor() { }

    static GenericError(callback: (r: Result) => void): ((r: Result) => void) {
        return (r: Result) => {
            callback({ result: ResultCode.Error, message: "Error interno." });
        };
    }

    public errorHandlerGeneric<T>(con: any,
        errorCallback: (r: Result) => void,
        successCallback: (result: T) => void,
        friendlyError?: string): ((err: any, res: any) => void) {

        return (err: any, res: T) => {
            if (err) {
                this.errorModel(con, err, MainModel.GenericError(errorCallback), friendlyError);
            }
            else {
                successCallback(res);
            }
        };
    }

    protected errorModel(con: any, err: SqlError, callBack: (r: Result) => void, friendlyError?: string): void {
        // TODO: hacer async usando algun log de logeo asyncronico
        try {
            const INSERT_ERROR: string = `INSERT INTO errors_backend (concept, message, details, stack, clientIP, idLoggedUser)
                                          VALUES('no concept yet', ?, ?, ?, 'no IP yet', 0)`;
            let values = [friendlyError + SqlString.escape(err.sqlMessage), SqlString.escape(JSON.stringify(err)), err.stack ? SqlString.escape(JSON.stringify(err.stack)) : ''];
            con.query(INSERT_ERROR, values, (logErr: any, res: any[]) => {
                if (logErr) {
                    console.error(new Date(), logErr);
                }
            });
        } catch (innerErr) {
            // if error is thrown when logging error -> do nothing
            console.error(new Date(), err);
            console.error(new Date(), innerErr);
        }
        finally {
            let errorFormatted: Result;
            try { errorFormatted = this.formatError(err, friendlyError); }
            catch {
                errorFormatted = {
                    result: ResultCode.Error,
                    message: 'error formateando el error'
                };
            }
            callBack(errorFormatted);
        }
    }

    protected errorHandlerWithPromise(con: any, err: SqlError): Promise<any> {
        try {
            const INSERT_ERROR: string = `INSERT INTO errors_backend (concept, message, details, stack, clientIP, idLoggedUser)
                                          VALUES('no concept yet', ?, ?, ?, 'no IP yet', 0)`;
            let values = [SqlString.escape(err.sqlMessage), SqlString.escape(JSON.stringify(err)), err.stack ? SqlString.escape(JSON.stringify(err.stack)) : ''];

            // Error is logged async
            con.query(INSERT_ERROR, values, (logErr: any, res: any[]) => {
                if (logErr) {
                    // if error is thrown when logging error -> do nothing
                    console.error(new Date(), logErr);
                }
            });
        } catch (innerErr) {
            // if error is thrown when logging error -> do nothing
            console.error(new Date(), err);
            console.error(new Date(), innerErr);
        }
        finally {
            let errorFormatted: string;
            try { errorFormatted = this.formatError(err).message; }
            catch (e) {
                // if error is thrown when formatting error -> do nothing
                console.error(new Date(), e);

                errorFormatted = 'Error interno';
            }
            return Promise.reject(errorFormatted);
        }
    }

    protected query(con: any, query: string, params: any[], callBack: (r: ResultWithData<any>) => void): void {
        con.query(query, params, (err: any, resultQuery: any[]) => {
            if (!!err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: resultQuery
                });
            }
        });
    }

    protected formatError(err: { code: string }, friendlyError: string = ''): ResultError {
        var errorFormatted: ResultError;

        if (err.code == 'ER_DUP_ENTRY') {
            errorFormatted = {
                result: ResultCode.Error,
                message: `${friendlyError ? friendlyError + '. ' : ''}No se pudo insertar, elemento duplicado.`,
                details: err
            };
        } else if (err.code == 'ER_ROW_IS_REFERENCED_2') {
            errorFormatted = {
                result: ResultCode.Error,
                message: `${friendlyError ? friendlyError + '. ' : ''}No se pudo borrar el elemento porque es utilizado en otra parte del sistema`,
                details: err
            };
        } else {
            errorFormatted = {
                result: ResultCode.Error,
                message: `${friendlyError ? friendlyError + '. ' : 'Error interno'}`,
                details: err
            };
        }
        return errorFormatted;
    }

    //
    // TODO: revisar que esta convirtiendo bien
    //
    //
    protected formatDateTimeSql(date: Date): string | null {
        if (!date) {
            return null;
        }
        return moment(date).format("YYYY-MM-DD HH:mm:ss");
    }

    //
    // TODO: revisar que esta convirtiendo bien
    //
    //
   protected formatDateSql(date: Date): string | null {
	if (!date) {
            return null;
        }
        return moment(date).format("YYYY-MM-DD");
    }



    //protected replaceUnescapeableChars(s: string): string {
       //return s.replace(/[^\x00-\x7F]/g, "");
    //}

    
    protected replaceUnescapeableChars(s: string | null): string {
    if (s === null || typeof s === 'undefined') {
        return "";
    }
    return s.replace(/[^\x00-\x7F]/g, "");

    }
	

}

export interface SqlError {
    code: string;
    sqlMessage: string;
    stack: string
}
