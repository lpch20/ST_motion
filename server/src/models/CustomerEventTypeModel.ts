import { ResultWithData, ResultCode } from '../../../datatypes/result';
import { MainModel } from './mainModel';
import { EventType } from '../../../datatypes/eventType';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';

export class CustomerEventType extends MainModel {
    constructor(private controllerConnections: ControllerDBClientsConnections) {
        super();
    }

    getAll(dbName: string, callBack: (r: ResultWithData<EventType[]>) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        var mainThis = this;
        pool.getConnection(function (err: any, con: any) {
            if (!!err) {
                mainThis.errorModel(con,err,callBack);
            } else {
                const QUERY: string = 'SELECT * FROM event_type';
                con.query(QUERY, function (err: any, result: EventType[]) {
                    if (!!err) {
                        mainThis.errorModel(con,err,callBack);
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
}