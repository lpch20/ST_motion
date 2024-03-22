import { ResultWithData, ResultCode } from '../../../datatypes/result';
import { MainModel } from './mainModel';
import { BranchOffice } from '../../../datatypes/BranchOffice';

export class BranchOfficeModel extends MainModel {
    constructor() {
        super();
    }

    getAll(connection: any, callBack: (r: ResultWithData<BranchOffice>) => void): void {
        let mainThis = this;
        let query: string = "SELECT * FROM branch_office"
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