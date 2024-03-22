import { CustomerCampaign } from '../../../datatypes/CustomerCampaign';
import { DebtData } from '../../../datatypes/DebtData';
import { ResultCode, ResultWithData } from '../../../datatypes/result';
import { IQueryableConnection } from '../controllers/mainController';
import { dbParser } from './dbUtils/dbParser';
import { MainModel } from './mainModel';

export class DebtModel extends MainModel {

    getCustomerDebtDataByCI(ci: string, connection: IQueryableConnection, callBack: (r: ResultWithData<DebtData>) => void): void {
        const query: string = "SELECT * FROM customer_debt WHERE ci = ?";
        connection.query(query, [ci], (err: any, resultQuery: any) => {
            if (err) {
                this.errorModel(connection, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: resultQuery && resultQuery.length > 0 ? resultQuery[0] : null
                });
            }
        });
    }

    getCustomerCampaignAssignments(idCustomer: number, conn: any, callBack: (r: ResultWithData<CustomerCampaign[]>) => void): void {
        const QUERY = ` SELECT *
                        FROM customer_campaign
                        WHERE idCustomer = ?
                        ORDER BY date DESC`;

        conn.query(QUERY, [idCustomer], (err: any, resultQuery: any) => {
            if (err) {
                this.errorModel(conn, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: resultQuery
                });
            }
        });
    }

    getCustomerForSMS(connection: any, callBack: (r: ResultWithData<any>) => void): void {
        const QUERY: string = ` SELECT c.id,c.ci, c.names,c.lastnames, cp.phone 
                                FROM customer_debt cb 
                                JOIN customer c ON cb.idCustomer = c.id 
                                JOIN customer_phone cp ON cp.idCustomer = c.id 
                                WHERE minimumToCharge <= 2 AND maxToCharge > 0
                                        AND cp.phone LIKE '09%' GROUP BY cp.phone`;

        connection.query(QUERY, (err: any, resultQuery: any) => {
            if (!!err) {
                this.errorModel(connection, err, callBack);
            } else {
                callBack({ result: ResultCode.OK, message: '', data: resultQuery });
            }
        });
    }

    updataCustomerDebtData(debtData: DebtData, connection: any, callBack: (r: ResultWithData<any>) => void): void {
        const QUERY = ` UPDATE customer_debt
                        SET lastUpdate = NOW(),
                            idCustomer = ?,
                            haveAmnesty = ?,
                            haveCreditCard = ?,
                            havePurchaseOrder = ?,
                            minimumToCharge = ?,
                            maxToCharge = ?,
                            amountOrderPesos = ?,
                            amountOrderDollar = ?,
                            amountAmnestyPesos = ?,
                            amountAmnestyDollar = ?,
                            amountCreditCardPesos = ?,
                            amountCreditCardDollar = ?,
                            delayCreditCard = ?,
                            delayOrder = ?,
                            delayAmnesty = ?,
                            totalFeesDelayAmnesty = ?,
                            totalFeesAmnesty = ?
                        WHERE ci = ?`;

        const VALUES = [
            debtData.idCustomer,
            debtData.haveAmnesty,
            debtData.haveCreditCard,
            debtData.havePurchaseOrder,
            dbParser.parseNumber(debtData.minimumToCharge),
            dbParser.parseNumber(debtData.maxToCharge),
            dbParser.parseNumber(debtData.amountOrderPesos),
            dbParser.parseNumber(debtData.amountOrderDollar),
            dbParser.parseNumber(debtData.amountAmnestyPesos),
            dbParser.parseNumber(debtData.amountAmnestyDollar),
            dbParser.parseNumber(debtData.amountCreditCardPesos),
            dbParser.parseNumber(debtData.amountCreditCardDollar),
            debtData.delayCreditCard,
            debtData.delayOrder,
            debtData.delayAmnesty,
            debtData.totalFeesDelayAmnesty,
            debtData.totalFeesAmnesty,
            debtData.ci];
        connection.query(QUERY, VALUES, (err: any, resultQuery: any) => {
            if (err) {
                this.errorModel(connection, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: resultQuery
                });
            }
        });
    }

    addCustomerDebtData(debtData: DebtData, conn: any, callBack: (r: ResultWithData<any>) => void): void {
        const QUERY = ` INSERT INTO customer_debt (idCustomer, haveAmnesty, haveCreditCard, havePurchaseOrder, minimumToCharge, maxToCharge, amountOrderPesos,
                            amountOrderDollar, amountAmnestyPesos, amountAmnestyDollar, amountCreditCardPesos, amountCreditCardDollar,
                            delayCreditCard, delayOrder, delayAmnesty, totalFeesDelayAmnesty, totalFeesAmnesty, ci)
                        VALUES(?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`;
        const VALUES = [
            debtData.idCustomer,
            debtData.haveAmnesty,
            debtData.haveCreditCard,
            debtData.havePurchaseOrder,
            dbParser.parseNumber(debtData.minimumToCharge),
            dbParser.parseNumber(debtData.maxToCharge),
            dbParser.parseNumber(debtData.amountOrderPesos),
            dbParser.parseNumber(debtData.amountOrderDollar),
            dbParser.parseNumber(debtData.amountAmnestyPesos),
            dbParser.parseNumber(debtData.amountAmnestyDollar),
            dbParser.parseNumber(debtData.amountCreditCardPesos),
            dbParser.parseNumber(debtData.amountCreditCardDollar),
            debtData.delayCreditCard,
            debtData.delayOrder,
            debtData.delayAmnesty,
            debtData.totalFeesDelayAmnesty,
            debtData.totalFeesAmnesty,
            debtData.ci];
        conn.query(QUERY, VALUES, (err: any, resultQuery: any) => {
            if (err) {
                this.errorModel(conn, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: resultQuery
                });
            }
        });
    }

    addCustomerCampaignAssign(idCustomer: number, idCampaign: number, idUser: number, connection: any, callBack: (r: ResultWithData<any>) => void): void {
        const QUERY = "INSERT INTO customer_campaign (idCustomer,idCampaign,date,idUser) VALUES(?,?,NOW(),?)";
        connection.query(QUERY, [idCustomer, idCampaign, idUser], (err: any, resultQuery: any) => {
            if (!!err) {
                console.log(err);
                this.errorModel(connection, err, callBack);
            } else {
                callBack({ result: ResultCode.OK, message: '', data: resultQuery });
            }
        });
    }

    updateCustomerAssignDate(ci: string, date: Date, connection: any, callBack: (r: ResultWithData<any>) => void): void {
        const QUERY: string = "UPDATE customer SET assignDate = ? WHERE ci = ?";
        connection.query(QUERY, [date, ci], (err: any, resultQuery: any) => {
            if (!!err) {
                console.log(err);
                this.errorModel(connection, err, callBack);
            } else {
                callBack({ result: ResultCode.OK, message: '', data: resultQuery });
            }
        });
    }

    updateCustomerAgreement(customerId: number, agreement: any, conn: any, callBack: (r: ResultWithData<any>) => void): void {
        const QUERY = ` UPDATE customer_agreement
                        SET amountOfDebt = ?, amountOfFees = ?, amountOfFeesUnpaid = ?, currentFee = ? ,
                            firstFeeUnpaid = ? , lastFeePaid = ? , lastFeeUnpaid = ?, dateSigned = ?, amountSigned = ?
                        WHERE idCustomer = ?`;
        const VALUES = [
            dbParser.parseNumber(agreement.amountOfDebt),
            agreement.amountOfFees,
            agreement.amountOfFeesUnpaid,
            dbParser.parseNumber(agreement.currentFee),
            this.formatDateSql(agreement.firstFeeUnpaid),
            dbParser.parseNumber(agreement.lastFeePaid),
            this.formatDateSql(agreement.lastFeeUnpaid),
            this.formatDateSql(agreement.dateSigned),
            dbParser.parseNumber(agreement.amountSigned),
            customerId
        ];
        conn.query(QUERY, VALUES, (err: any, resultQuery: any) => {
            if (err) {
                console.log(err);
                this.errorModel(conn, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: '',
                    data: resultQuery
                });
            }
        });
    }

    addCustomerAgreement(idCustomer: number, agreement: any, conn: any, callBack: (r: ResultWithData<any>) => void): void {
        const QUERY = ` INSERT INTO customer_agreement(idCustomer,amountOfDebt, amountOfFees, amountOfFeesUnpaid, currentFee,
                                                    firstFeeUnpaid , lastFeePaid, lastFeeUnpaid ,dateSigned, amountSigned)
                        VALUES(?,?,?,?,?,?,?,?,?,?)`;
        const VALUES = [
            idCustomer,
            dbParser.parseNumber(agreement.amountOfDebt),
            agreement.amountOfFees,
            agreement.amountOfFeesUnpaid,
            dbParser.parseNumber(agreement.currentFee),
            this.formatDateSql(agreement.firstFeeUnpaid),
            dbParser.parseNumber(agreement.lastFeePaid),
            this.formatDateSql(agreement.lastFeeUnpaid),
            this.formatDateSql(agreement.dateSigned),
            dbParser.parseNumber(agreement.amountSigned)
        ];
        conn.query(QUERY, VALUES, (err: any, resultQuery: any) => {
            if (err) {
                console.log(err);
                this.errorModel(conn, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: '',
                    data: resultQuery
                });
            }
        });
    }

    getCustomerAgreement(idCustomer: number, conn: any, callBack: (r: ResultWithData<any>) => void): void {
        const QUERY = ` SELECT *
                        FROM customer_agreement
                        WHERE idCustomer = ?`;
        const VALUES = [idCustomer];
        conn.query(QUERY, VALUES, (err: any, resultQuery: any) => {
            if (err) {
                this.errorModel(conn, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: '',
                    data: resultQuery
                });
            }
        });
    }
}

