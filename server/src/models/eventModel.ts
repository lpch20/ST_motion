import { ClientEvent } from '../../../datatypes/clientEvent';
import { ResultCode, ResultWithData } from '../../../datatypes/result';
import { IQueryableConnection } from '../controllers/mainController';
import { MainModel } from './mainModel';

export class EventModel extends MainModel {
    constructor() {
        super();
    }

    public insertCustomerEventError(idUser: number, customerEvent: ClientEvent, error: string, con: IQueryableConnection,
        callBack: (r: ResultWithData<{ insertId: number }>) => void): void {
        const QUERY: string = ` INSERT INTO errors_customer_events(idCustomer,phone,date,dateReminder,extension,operario,message,eventType,idUser,error_date,error_message)
                                VALUES(?,?,?,?,?,1,?,?,?,?,?)`;
        const values = [customerEvent.idCustomer, customerEvent.phone,
        super.formatDateTimeSql(customerEvent.date), super.formatDateTimeSql(customerEvent.dateReminder), customerEvent.ext,
        customerEvent.message, customerEvent.eventType, idUser, super.formatDateTimeSql(new Date()), error];

        con.query(QUERY, values, (err: any, resultQueryComments: any) => {
            if (!!err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: { insertId: resultQueryComments.insertId }
                });
            }
        });
    }
}
