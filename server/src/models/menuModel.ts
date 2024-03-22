import { ResultWithData, ResultCode } from '../../../datatypes/result';
import { MainModel } from './mainModel';
import { BreakType } from '../../../datatypes/BreakType';

export class MenuModel extends MainModel {
    constructor() {
        super();
    }

    getMenuByRol(idRol: number, con: any, callBack: (r: ResultWithData<BreakType[]>) => void): void {
        var mainThis = this;
        let query: string = "SELECT * FROM menu m INNER JOIN menu_rol mr ON m.id = mr.idMenu WHERE idRol = ?";
        let queryParameters: any[] = [idRol];
        con.query(query, queryParameters,
            function (err: any, result: any) {
                if (!!err) {
                    mainThis.errorModel(con, err, callBack);
                } else {
                    //con.release();
                    callBack({
                        result: ResultCode.OK,
                        message: 'OK',
                        data: result
                    });
                }
            });
    }
}