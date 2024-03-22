import { CustomerPayment } from '../../../datatypes/CustomerPayment';
import { ResultCode, ResultWithData } from '../../../datatypes/result';
import { IQueryableConnection } from '../controllers/mainController';
import { dbParser } from './dbUtils/dbParser';
import { MainModel } from './mainModel';

export class PaymentsModel extends MainModel {

    addOrUpdatePaymentCustomer(idCustomer: number, customerPayment: CustomerPayment, con: IQueryableConnection, callBack: (r: ResultWithData<any>) => void): void {
        // si existe el pago, se actualiza, sino se inserta
        this.existPaymentCustomer(idCustomer, customerPayment.paymentDate, customerPayment.currentFee, con, (r) => {
            if (r.result == ResultCode.Error) {
                callBack(r);
            } else {
                if (r.data == true) {
                    this.updatePaymentCustomer(idCustomer, customerPayment, con, r => {
                        callBack(r);
                    });
                } else {
                    this.addPaymentCustomer(idCustomer, customerPayment, con, r => {
                        callBack(r);
                    });
                }
            }
        });
    }

    addPaymentCustomer(idCustomer: number, customerPayment: CustomerPayment, conn: IQueryableConnection, callBack: (r: ResultWithData<any>) => void): void {

        const QUERY = `INSERT INTO customer_payment(idCustomer,ci,signatureDate,amountOfFees,expirationDate,paymentDate,amount,currentFee)
                        VALUES(?,?,?,?,?,?,?,?)`;
        const values = [
            idCustomer,
            customerPayment.ci,
            this.formatDateTimeSql(customerPayment.signatureDate),
            customerPayment.amountOfFees,
            this.formatDateTimeSql(customerPayment.expirationDate),
            this.formatDateTimeSql(customerPayment.paymentDate),
            dbParser.parseNumber(customerPayment.amount),
            customerPayment.currentFee
        ];
        conn.query(QUERY, values, (err: any, result: any) => {
            if (err) {
                this.errorModel(conn, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result
                });
            }
        });
    }

    updatePaymentCustomer(idCustomer: number, customerPayment: CustomerPayment, conn: IQueryableConnection, callBack: (r: ResultWithData<any>) => void): void {
        const QUERY = ` UPDATE customer_payment
                        SET signatureDate = ?, amountOfFees = ?, expirationDate = ?, amount = ?
                        WHERE idCustomer = ? AND paymentDate = ? AND currentFee = ?`;
        const values = [
            this.formatDateTimeSql(customerPayment.signatureDate),
            customerPayment.amountOfFees,
            this.formatDateTimeSql(customerPayment.expirationDate),
            dbParser.parseNumber(customerPayment.amount),
            idCustomer,
            this.formatDateTimeSql(customerPayment.paymentDate),
            customerPayment.currentFee
        ];
        conn.query(QUERY, values, (err: any, result: any) => {
            if (err) {
                this.errorModel(conn, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result
                });
            }
        });
    }

    existPaymentCustomer(idCustomer: number, paymentDate: Date, currentFee: number, conn: IQueryableConnection, callBack: (r: ResultWithData<boolean>) => void): void {
        const QUERY = ` SELECT *
                        FROM customer_payment
                        WHERE idCustomer= ? AND paymentDate = ? AND currentFee = ?`;
        const values = [
            idCustomer,
            this.formatDateTimeSql(paymentDate),
            currentFee
        ];

        conn.query(QUERY, values, (err: any, result: any) => {
            if (err) {
                this.errorModel(conn, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result && result.length > 0
                });
            }
        });
    }
}
