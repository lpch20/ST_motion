import { MainModel } from './mainModel';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { Account } from '../../../datatypes/account';

export class AccountModel extends MainModel {

    constructor(private masterDBController: ControllerDBMaster) {
        super();
    }

    getById(id: number, callback: (err: any, account: Account) => void): void {
        const QUERY = "SELECT * FROM  accounts WHERE id = ?";
        let masterConn = this.masterDBController.getMasterConnection().getConnection();
        masterConn.query(QUERY, [id], (err: any, res: any) => {
            // si ejecuto sin error y devolvio exactamente 1 invoco el callback
            if (!err && res && res.length == 1) {
                callback(err, res[0]);
            } else {
                callback(err, res);
            }
        });
    }
}
