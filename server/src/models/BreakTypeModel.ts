import { ResultWithData, ResultCode } from '../../../datatypes/result';
import { MainModel } from './mainModel';
import { BreakType } from '../../../datatypes/BreakType';
import { IQueryableConnection } from '../controllers/mainController';

export class BreakTypeModel extends MainModel {
    constructor() {
        super();
    }

    getAll(con: IQueryableConnection, callBack: (r: ResultWithData<BreakType[]>) => void): void {
        const QUERY: string = 'SELECT * FROM break_type';
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
}
