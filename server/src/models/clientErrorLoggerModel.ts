import { Result, ResultCode } from '../../../datatypes/result';
import { MainModel } from './mainModel';
import { IClientError } from '../../../datatypes/clientError';
var SqlString = require('sqlstring');

export class ClientErrorLoggerModel extends MainModel {
    constructor() {
        super();
    }

    add(clientError: IClientError, con: any, callBack: (r: Result) => void): void {
        const QUERY = 'INSERT INTO errors_frontend(name,user,status,url,message,stack) VALUES(?,?,?,?,?,?)';
        const VALUES = [clientError.name, clientError.user, clientError.status, clientError.url, clientError.message, 
            SqlString.escape(JSON.stringify(clientError.stack))];
        con.query(QUERY, VALUES, (err: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK'
                });
            }
        });
    }
}