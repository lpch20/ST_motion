import { Action } from '../../../datatypes/Action';
import { ResultCode, ResultWithData } from '../../../datatypes/result';
import { MainModel } from './mainModel';

export class ActionModel extends MainModel {
    constructor() {
        super();
    }

    getAll(connection: any, callBack: (r: ResultWithData<Action>) => void): void {
        let mainThis = this;
        let query: string = "SELECT * FROM action"
        connection.query(query,
            function (err: any, resultQuery: any) {
                if (!!err) {
                    mainThis.errorModel(connection, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: '', data: resultQuery });
                }
            });
    }
}