import { ResultWithData, ResultCode } from '../../../datatypes/result';
import { MainModel } from './mainModel';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';

export class DepartamentModel extends MainModel {    
    constructor(private controllerConnections: ControllerDBClientsConnections) {
        super();
    }
    
    getAll(dbName: string, callBack: (r: ResultWithData<any[]>) => void): void {
        const pool = this.controllerConnections.getUserConnection(dbName);
        const QUERY: string = 'SELECT * FROM departaments';
        pool.query(QUERY, (err: any, result: any[]) => {
            if (!!err) {
                this.errorModel(pool, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result
                });
            }
        });
    }

    getAllCities(dbName: string, callBack: (r: ResultWithData<any[]>) => void): void {
        const  pool = this.controllerConnections.getUserConnection(dbName);
        const QUERY: string = 'SELECT * FROM city';
        pool.query(QUERY,  (err: any, result: any[]) => {
            if (!!err) {
                this.errorModel(pool,err,callBack);
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
