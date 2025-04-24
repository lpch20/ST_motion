import _ from 'lodash';
import { ClientEvent } from '../../../datatypes/clientEvent';
import { Customer } from '../../../datatypes/Customer';
import { CustomerCampaign } from '../../../datatypes/CustomerCampaign';
import { Result, ResultCode, ResultError, ResultWithData } from '../../../datatypes/result';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { IConnection, IQueryableConnection, IQueryablePromiseConnection } from '../controllers/mainController';
import { MainModel } from './mainModel';
import { UserModel } from './userModel';

export class CustomerModel extends MainModel {

    private userModel: UserModel;

    constructor(private controllerConnections: ControllerDBClientsConnections) {
        super();
        this.userModel = new UserModel(controllerConnections);
    }

    deactivatePhonesCustomer(idCustomer: number, connection: any, callBack: (r: ResultWithData<any>) => void): void {
        let mainThis = this;
        let query: string = "UPDATE customer_phone SET active = 0 WHERE idCustomer = ?"
        connection.query(query, [idCustomer],
            function (err: any, resultQuery: any) {
                if (!!err) {
                    mainThis.errorModel(connection, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: '', data: resultQuery });
                }
            });
    }

    getDeactivateCustomers(connection: any, callBack: (r: ResultWithData<any>) => void): void {
        let mainThis = this;
        let query: string = "SELECT * FROM customer WHERE active = 0"
        connection.query(query,
            function (err: any, resultQuery: any) {
                if (!!err) {
                    mainThis.errorModel(connection, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: '', data: resultQuery });
                }
            });
    }

    getCustomersNotAssignedQueue(connection: any, callBack: (r: ResultWithData<any>) => void): void {
        let mainThis = this;
        let query: string = "SELECT * FROM `customer` WHERE id NOT IN (SELECT idCustomer FROM `item_queue`)"
        connection.query(query,
            function (err: any, resultQuery: any) {
                if (!!err) {
                    mainThis.errorModel(connection, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: '', data: resultQuery });
                }
            });
    }

    activatePhonesCustomer(idCustomer: number, phones: Array<string>, connection: any, callBack: (r: ResultWithData<any>) => void): void {
        let mainThis = this;
        let query: string = "UPDATE customer_phone SET active = 1 WHERE idCustomer = ? AND phone IN (?)"
        connection.query(query, [idCustomer, phones],
            function (err: any, resultQuery: any) {
                if (!!err) {
                    mainThis.errorModel(connection, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: '', data: resultQuery });
                }
            });
    }

    deleteDuplicatePhoneCustomer(idCustomer: number, phone: string, connection: any, callBack: (r: ResultWithData<any>) => void): void {
        let mainThis = this;
        let query: string = "SELECT count(*) as countPhones FROM customer_phone WHERE idCustomer = ? AND phone = ?"
        connection.query(query, [idCustomer, phone],
            function (err: any, resultQuery: any) {
                if (!!err) {
                    mainThis.errorModel(connection, err, callBack);
                } else {
                    if (resultQuery[0].countPhones > 1) {
                        let queryDuplicate = "delete from customer_phone where idCustomer = ? AND phone = ? LIMIT ?";
                        connection.query(queryDuplicate, [idCustomer, phone, resultQuery[0].countPhones - 1],
                            function (err: any, resultQuery2: any) {
                                if (!!err) {
                                    mainThis.errorModel(connection, err, callBack);
                                } else {
                                    callBack({ result: ResultCode.OK, message: '', data: resultQuery2 });
                                }
                            });
                    } else {
                        callBack({ result: ResultCode.OK, message: '', data: resultQuery });
                    }
                }
            });
    }

    /**
     * Retorna los telefonos que tienen en comun el customer actualmente y lo que se le esta enviando como telefonos actuales
     * Es util para saber si existen telefonos nuevos.
     * @param customerId 
     * @param phones - Telefonose que se envian para el customer 
     * @param connection 
     * @param callBack 
     */
    getPhonesInCustomer(customerId: number, phones: Array<string>, connection: any, callBack: (r: ResultWithData<any>) => void): void {
        let mainThis = this;
        let query: string = "SELECT phone FROM customer_phone WHERE phone IN (?) AND idCustomer = ?"
        connection.query(query, [phones, customerId],
            function (err: any, resultQuery: any) {
                if (!!err) {
                    mainThis.errorModel(connection, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: '', data: resultQuery });
                }
            });
    }

    updatePhonePosition(customerId: number, phone: string, position: number, connection: any, callBack: (r: ResultWithData<any>) => void): void {
        let mainThis = this;
        let query: string = "UPDATE customer_phone SET position =? , active = 1 WHERE phone = ? AND idCustomer = ?"
        connection.query(query, [position + 1, phone, customerId],
            function (err: any, resultQuery: any) {
                if (!!err) {
                    mainThis.errorModel(connection, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: '', data: resultQuery });
                }
            });
    }

    update(customer: any, con: IConnection, callBack: (r: ResultWithData<Customer[]>) => void): void {
        const QUERY = `UPDATE customer
                        SET lastUpdate = NOW(), lastnames = ?,  email = ?, address = ?, idDepartment = ?, idCity = ?, idCareer = ?
                        WHERE ci = ?`;
        const values = [super.replaceUnescapeableChars(customer.lastnames), customer.email, super.replaceUnescapeableChars(customer.address),
        customer.idDepartment, customer.idCity, customer.idCareer, customer.ci];
        con.query(QUERY, values, (err: any, result: any[]) => {
            if (err) {
                con.rollback(() => {
                    this.errorModel(con, err, callBack);
                });
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result
                });
            }
        });
    }

    addPhoneCustomer(idCustomer: number, phone: string, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        var mainThis = this;
        const QUERY: string = 'INSERT INTO customer_phone (idCustomer,phone,position,active) VALUES (?,?,0,1)';
        con.query(QUERY, [idCustomer, phone],
            function (err: any, result: any[]) {
                if (!!err) {
                    con.rollback(function () {
                        mainThis.errorModel(con, err, callBack);
                    });
                } else {
                    callBack({ result: ResultCode.OK, message: 'OK' });
                }
            }
        );
    }

    existCustomer(ci: string, con: IQueryableConnection, callBack: (r: ResultWithData<boolean>) => void): void {
        const query = "SELECT * FROM customer WHERE ci = ?";
        con.query(query, [ci], (err: any, resultQuery: any[]) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: resultQuery && resultQuery.length > 0
                });
            }
        });
    }

    addCustomer(data: any, con: any, callBack: (r: ResultWithData<any>) => void): void {
        const QUERY = `INSERT INTO customer (lastUpdate,names,lastnames,email,date,idDepartment,idCity,address,idCareer,ci,lastImportId)
                    VALUES(NOW(),?,?,?,?,?,?,?,?,?,?)`;
        const VALUES = [
            super.replaceUnescapeableChars(data.firstnames),
            super.replaceUnescapeableChars(data.lastnames),
            data.email,
            super.formatDateTimeSql(data.date),
            data.idDepartment,
            data.idCity,
            super.replaceUnescapeableChars(data.address),
            data.idCareer,
            data.ci,
            data.lastImportId,
        ];
        con.query(QUERY, VALUES, (err: any, resultQuery: any) => {
            if (!!err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: '',
                    data: resultQuery.insertId
                });
            }
        });
    }

    updateLastImportId(customer: any, con: IConnection, callBack: (r: ResultWithData<Customer[]>) => void): void {
        const QUERY = `UPDATE customer
                        SET lastImportId = ?, isActive = 1
                        WHERE ci = ?`;
        const values = [customer.lastImportId, customer.ci];
        con.query(QUERY, values, (err: any, result: any[]) => {
            if (err) {
                con.rollback(() => {
                    this.errorModel(con, err, callBack);
                });
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result
                });
            }
        });
    }

    getNumberOfCustomersWithLastImportId(lastImportId: number, connection: IConnection, callBack: (r: ResultWithData<number>) => void): void {
        let mainThis = this;
        let query: string = "SELECT * FROM customer WHERE lastImportId = ?"
        connection.query(query, [lastImportId],
            function (err: any, resultQuery: any) {
                if (!!err) {
                    mainThis.errorModel(connection, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: '', data: resultQuery.length });
                }
            });
    }

    disableCustomersForOlderLastImport(importId: number, con: IConnection, callBack: (r: ResultWithData<Customer[]>) => void): void {
        const QUERY = `UPDATE customer
                        SET isActive = 0
                        WHERE lastImportId <> ?`;
        const values = [importId];
        con.query(QUERY, values, (err: any, result: any[]) => {
            if (err) {
                con.rollback(() => {
                    this.errorModel(con, err, callBack);
                });
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result
                });
            }
        });
    }

    getNext(idQueue: number, idUser: number, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        const QUERY: string = ` SELECT c.*
                                FROM customer c
                                INNER JOIN item_queue iq ON c.id = iq.idCustomer
                                WHERE iq.status = 'withoutCalling' AND iq.idQueue = ? AND
                                        ( iq.idUser IS NULL OR iq.idUser = ?) AND c.isActive = 1
                                ORDER BY itemOrder ASC,lastInteraction ASC, assignDate DESC, iq.id ASC
                                LIMIT 6`;
        con.query(QUERY, [idQueue, idUser], (err: any, result: any[]) => {
            if (err) {
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

    // getNext(idQueue: number, idUser: number, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
    //     const QUERY: string = ` (
    //                                 SELECT c.*, iq.idUser as idUser, iq.itemOrder, 1 as metaOrder, NOW() as callDate
    //                                 FROM customer c
    //                                 INNER JOIN item_queue iq ON c.id = iq.idCustomer
    //                                 WHERE iq.status = 'withoutCalling' AND iq.idQueue = ? AND
    //                                     ( iq.idUser IS NULL OR iq.idUser = ?) AND
    //                                     NOT EXISTS ( SELECT * FROM customer_events ce WHERE ce.idCustomer = c.id)
    //                             )
    //                             UNION
    //                             (
    //                                 SELECT c.*, iq.idUser as idUser, iq.itemOrder, 2 as metaOrder, ce.date as callDate
    //                                 FROM customer c
    //                                 INNER JOIN customer_events ce ON c.id = ce.idCustomer
    //                                 INNER JOIN (SELECT idCustomer, MAX(date) AS Maxdate
    //                                             FROM customer_events
    //                                             GROUP BY idCustomer) maxCE ON ce.idCustomer = maxCE.idCustomer AND ce.date = maxCE.Maxdate
    //                                 INNER JOIN item_queue iq ON c.id = iq.idCustomer
    //                                 WHERE iq.status = 'withoutCalling' AND iq.idQueue = ? AND
    //                                     ( iq.idUser IS NULL OR iq.idUser = ?)
    //                             )
    //                             ORDER BY idUser DESC, itemOrder ASC, metaOrder ASC, date ASC        
    //                             LIMIT 6
    //                           `;
    //     con.query(QUERY, [idQueue, idUser, idQueue, idUser], (err: any, result: any[]) => {
    //         if (err) {
    //             this.errorModel(con, err, callBack);
    //         } else {
    //             callBack({
    //                 result: ResultCode.OK,
    //                 message: 'OK',
    //                 data: result
    //             });
    //         }
    //     });
    // }

    addCustomers(data: any, dbName: string, callBack: (r: ResultWithData<any>) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection((err: any, con: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                const query = `INSERT INTO customer (names, lastnames, email, date, idDepartment, idCity, address, idCareer, ci) 
                                VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)`;
                let _data = data[0];
                con.query(query, [super.replaceUnescapeableChars(_data.firstnames), super.replaceUnescapeableChars(_data.lastnames),
                _data.email, super.formatDateTimeSql(_data.date), _data.idDepartment, _data.idCity,
                super.replaceUnescapeableChars(_data.address), _data.idCareer, _data.ci], (err: any, resultQuery: any) => {
                    if (!!err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        let idCustomer: number = resultQuery.insertId;
                        _data.id = idCustomer;
                        this.addPhonesCustomer(_data, 0, con, dbName, callBack);
                    }
                });
            }
        });
    }

    getCustomerIdByCI(ci: string, con: IQueryableConnection, callBack: (r: ResultWithData<number>) => void): void {
        const query: string = "SELECT id FROM customer WHERE ci = ? LIMIT 1"
        con.query(query, [ci], (err: any, resultQuery: any[]) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: resultQuery && resultQuery.length > 0 ? resultQuery[0].id : undefined
                });
            }
        });
    }



    getAge(birthDate: Date): number {
        if (birthDate && birthDate !== null) {
            var today = new Date();
            var age = today.getFullYear() - birthDate.getFullYear();
            var m = today.getMonth() - birthDate.getMonth();
            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                age--;
            }
            return age;
        } else {
            return 0;
        }
    }

    getPhonesByCustomersById(id: number, dbName: string, callBack: (r: ResultWithData<any>) => void): void {
        var mainThis = this;
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection(function (err: any, con: any) {
            if (!!err) {
                mainThis.errorModel(con, err, callBack);
            } else {
                let query: string = "SELECT * FROM customer_phone  "
                query += " WHERE idCustomer = ? AND active = 1";
                con.query(query, [id],
                    function (err: any, resultQuery: any) {
                        if (!!err) {
                            mainThis.errorModel(con, err, callBack);
                        } else {
                            callBack({ result: ResultCode.OK, data: resultQuery, message: "" });
                        }
                    });
            }
        });
    }

    getCustomerById(id: number, dbName: string, callBack: (r: ResultWithData<Customer>) => void): void {
        var mainThis = this;
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection(function (err: any, con: any) {
            if (!!err) {
                mainThis.errorModel(con, err, callBack);
            } else {
                const QUERY: string = 'SELECT * FROM customer WHERE id = ?';
                con.query(QUERY, [id], function (err: any, resultQuery: Customer[]) {
                    if (!!err) {
                        mainThis.errorModel(con, err, callBack);
                    } else {
                        if (resultQuery.length > 0) {

                            let c = new Customer(id, resultQuery[0].ci, resultQuery[0].names, resultQuery[0].lastnames,
                                resultQuery[0].city, resultQuery[0].address, resultQuery[0].email,false, false, resultQuery[0].paymentIntention);
                            c.idDepartment = resultQuery[0].idDepartment;
                            c.idCity = resultQuery[0].idCity;
                            c.idCareer = resultQuery[0].idCareer;
                            c.age = mainThis.getAge(resultQuery[0].date);
                            const queryCampaign = "SELECT * FROM customer_campaign WHERE idCustomer = ? ORDER BY date DESC LIMIT 1";

                            mainThis.query(con, queryCampaign, [id], function (result: any) {
                                if (result.data.length > 0) {
                                    c.idCampaign = result.data[0].idCampaign;
                                }
                                const QUERY: string = 'SELECT * FROM customer_phone WHERE idCustomer = ? AND active = 1 ORDER  BY position ASC';
                                con.query(QUERY, [id], function (err: any, resultQueryPhones: any[]) {
                                    if (!!err) {
                                        mainThis.errorModel(con, err, callBack);
                                    } else {
                                        for (let i = 0; i < resultQueryPhones.length; i++) {
                                            c.addPhone(resultQueryPhones[i].phone);
                                        }
                                        con.release();
                                        callBack({ result: ResultCode.OK, message: 'OK', data: c });
                                        /*
                                        const QUERY: string = 'SELECT * FROM customer_events WHERE idCustomer = ?';
                                        con.query(QUERY, [id], function (err: any, resultQueryComments: any[]) {
                                            if (!!err) {
                                                mainThis.errorModel(con, err, callBack);
                                            } else {
                                                con.release();
                                                for (let i = 0; i < resultQueryComments.length; i++) {
                                                    let event: ICustomerEvent;
                                                    event = {
                                                        id: resultQueryComments[i].id,
                                                        idCustomer: resultQueryComments[i].idCustomer,
                                                        date: resultQueryComments[i].date,
                                                        dateReminder: resultQueryComments[i].dateReminder,
                                                        phone: resultQueryComments[i].phone,
                                                        ext: "00",
                                                        idUser: resultQueryComments[i].idUser,
                                                        annotation: resultQueryComments[i].message,
                                                        eventType: resultQueryComments[i].eventType
                                                    }
                                                    c.addEvent(new ClientEvent(event));
                                                }
                                                callBack({ result: ResultCode.OK, message: 'OK', data: c });
                                            }
                                        });
                                        */


                                    }
                                });
                            });
                        } else {
                            callBack({ result: ResultCode.Error, message: 'No existe un usuario con es id' });
                        }
                    }
                });
            }
        });
    }

    public getCustomersCampaign(idCustomers: number[], conn: IQueryableConnection, callback: (r: ResultWithData<CustomerCampaign[]>) => void) {
        const QUERY: string = ` SELECT cc.idCustomer, cc.idCampaign
                                FROM customer_campaign cc 
                                INNER JOIN (SELECT ccInner.idCustomer, MAX(ccInner.date) AS Maxdate
                                            FROM customer_campaign ccInner
                                            WHERE ccInner.idCustomer IN (?)
                                            GROUP BY ccInner.idCustomer) maxCC ON cc.idCustomer = maxCC.idCustomer AND cc.date = maxCC.Maxdate
                                WHERE cc.idCustomer IN (?)`;

        conn.query(QUERY, [idCustomers, idCustomers], (err: any, result: any[]) => {
            if (err) {
                this.errorModel(conn, err, callback);
            } else {
                callback({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result
                });
            }
        });
    }

    addEventSimple(idCustomer: number, message: string, user: string, con: IQueryableConnection, callBack: (r: ResultWithData<{ id: number }>) => void): void {
        this.userModel.getUserByUsername(user, con, (result: ResultWithData<any[]>) => {
            if (result.data !== undefined && result.data.length > 0) {
                var idUser = result.data[0].id;
                let QUERY: string = `INSERT INTO customer_events(idCustomer,date,message,eventType,idUser)
                                                     VALUES(?,NOW(),?,99,?)`;
                con.query(QUERY, [idCustomer, message, idUser], (err: any, resultQueryComments: any) => {
                    if (!!err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        callBack({ result: ResultCode.OK, message: 'OK', data: { id: resultQueryComments.insertId } });
                    }
                });

            } else {
                callBack({
                    result: ResultCode.Error,
                    message: 'Usuario no existe o no esta logeado'
                });
            }
        });
    }

    addEvent(eventRedirection: string, idCampaign: number, customerEvent: ClientEvent, user: string, withoutPhone: boolean, con: IQueryableConnection, callBack: (r: ResultWithData<{ id: number }>) => void): void {
        this.userModel.getUserByUsername(user, con, (result: ResultWithData<any[]>) => {
            if (result.data !== undefined && result.data.length > 0) {
                var idUser = result.data[0].id;
                let queryCampaign = "INSERT INTO customer_campaign(idCustomer,idCampaign,date,idUser) VALUE (?,?,NOW(),?)";
                con.query(queryCampaign, [customerEvent.idCustomer, idCampaign, idUser], (err: any, resultQueryCampaign: any[]) => {
                    if (!!err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        let QUERY: string = `INSERT INTO customer_events(idCustomer,idCampaign,idAction,idPay,phone,date,dateReminder,extension,operario,message,eventType,idUser,withoutPhone,paymentIntention)
                                                     VALUES(?,?,?,?,?,?,?,?,1,?,?,?,?,?)`;
                        con.query(QUERY, [customerEvent.idCustomer, idCampaign, customerEvent.idAction, customerEvent.idPayment, customerEvent.phone,
                        super.formatDateTimeSql(customerEvent.date), super.formatDateTimeSql(customerEvent.dateReminder), customerEvent.ext,
                        customerEvent.message, customerEvent.eventType, idUser, withoutPhone,customerEvent.paymentIntention], (err: any, resultQueryComments: any) => {
                            if (!!err) {
                                this.errorModel(con, err, callBack);
                            } else {
                                if (idCampaign === 3 || customerEvent.eventType === 2 || eventRedirection == "OtherCustomer") {
                                    let queryUpdate = "UPDATE item_queue SET status = 'called' WHERE idCustomer = ?";
                                    con.query(queryUpdate, [customerEvent.idCustomer], (err: any, _1: any[]) => {
                                        if (!!err) {
                                            this.errorModel(con, err, callBack);
                                        } else {
                                            callBack({ result: ResultCode.OK, message: 'OK', data: { id: resultQueryComments.insertId } });
                                        }
                                    });
                                } else {
                                    callBack({ result: ResultCode.OK, message: 'OK', data: { id: resultQueryComments.insertId } });
                                }
                            }
                        });
                    }
                });
            } else {
                callBack({
                    result: ResultCode.Error,
                    message: 'Usuario no existe o no esta logeado'
                });
            }
        });
    }

    updateItemQueueStatus(idCustomer: number, status: string, con: any, callBack: (r: ResultWithData<{ id: number }>) => void): void {
        var mainThis = this;
        let queryUpdate = "UPDATE item_queue SET status = ? WHERE idCustomer = ?";
        con.query(queryUpdate, [status, idCustomer],
            function (err: any, resultQueryCampaign: any[]) {
                if (!!err) {
                    mainThis.errorModel(con, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: 'OK' });
                }
            }
        );
    }

    customerLastInteraction(idCustomer: number, con: any, callBack: (r: ResultWithData<{ id: number }>) => void): void {
        var mainThis = this;
        let queryUpdate = "UPDATE customer SET lastInteraction = NOW() WHERE id = ?";
        con.query(queryUpdate, [idCustomer],
            function (err: any, resultQueryCampaign: any[]) {
                if (!!err) {
                    mainThis.errorModel(con, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: 'OK' });
                }
            }
        );
    }

    //#region item queue
    assignItemQueueUserToCustomer(idQueue: number, idUser: number, idCustomer: number, con: IQueryableConnection, callBack: (result: Result) => void): void {
        this.clearItemQueueUser(idQueue, idUser, con, clearUserRes => {
            if (clearUserRes.result === ResultCode.OK) {
                this.setItemQueueUser(idQueue, idUser, idCustomer, con, setUserRes => {
                    if (setUserRes.result === ResultCode.OK) {
                        callBack(setUserRes);
                    } else {
                        callBack(<ResultError>{
                            result: ResultCode.Error,
                            message: 'Error al asignar el usuario al elemento de la cola',
                            details: setUserRes
                        });
                    }
                });
            } else {
                callBack(<ResultError>{
                    result: ResultCode.Error,
                    message: 'Error al borrar asignación del usuario al elemento de la cola',
                    details: clearUserRes
                });
            }
        });
    };

    private setItemQueueUser(idQueue: number, idUser: number, idCustomer: number, con: IQueryableConnection, callBack: (r: Result) => void): void {
        const QUERY: string = ` UPDATE item_queue
                                SET idUser = ?
                                WHERE idQueue = ? AND idCustomer = ?`;
        con.query(QUERY, [idUser, idQueue, idCustomer], (err: any, resultQuery: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                });
            }
        });
    };

    private clearItemQueueUser(idQueue: number, idUser: number, con: IQueryableConnection, callBack: (r: Result) => void): void {
        const QUERY: string = ` UPDATE item_queue
                                SET idUser = NULL
                                WHERE idQueue = ? AND idUser = ? AND status = 'withoutCalling' `;
        con.query(QUERY, [idQueue, idUser], (err: any, resultQuery: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                });
            }
        });
    };

    setItemQueueFinish(idUser: number, idCustomer: number, con: IQueryableConnection, callBack: (r: ResultWithData<{ id: number }>) => void): void {
        const QUERY: string = 'SELECT * FROM queue_user WHERE idUser = ?';

        con.query(QUERY, [idUser], (err: any, resultQuery: any) => {
            if (!!err) {
                this.errorModel(con, err, callBack);
            } else {
                if (resultQuery.length > 0) {
                    const queryFinish: string = 'UPDATE item_queue SET status = "called" WHERE idQueue = ? AND idCustomer = ?';
                    con.query(queryFinish, [resultQuery[0].idQueue, idCustomer], (err: any, resultQueryFinish: any) => {
                        if (!!err) {
                            console.log(`ERROR => idUser => ${idUser} , idCustomer =>  ${idCustomer}`);
                            this.errorModel(con, err, callBack);
                        } else {
                            callBack({
                                result: ResultCode.OK,
                                message: 'OK',
                                data: resultQueryFinish
                            });
                        }
                    });
                }//fin del result query
                else {
                    callBack({ result: ResultCode.Error, message: 'No existe un queue_user con ese id' });
                }
            }
        })
    };

    //#endregion item queue

    /**
     * 
     * @param name 
     * @param lastname 
     * @param ci 
     * @param phone 
     * @param idQueue 
     * @param con 
     * @param callBack 
     */
    findCustomer(name: string, lastname: string, ci: string, phone: string, idQueue: number, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        let queryConditions = "";
        let queryParameters = [];
        if (name) {
            queryConditions += " names LIKE ? AND ";
            queryParameters.push('%' + name + '%');
        }
        if (lastname) {
            queryConditions += "lastnames LIKE ? AND ";
            queryParameters.push('%' + lastname + '%');
        }
        if (ci) {
            queryConditions += "ci LIKE ? AND ";
            queryParameters.push('%' + ci + '%');
        }
        queryConditions += "iq.idQueue = ? ";
        queryParameters.push(idQueue);

        if (phone == "") {
            let query = `SELECT c.* FROM customer c INNER JOIN item_queue iq ON c.id = iq.idCustomer
                             WHERE ${queryConditions} `;
            console.log(query);
            con.query(query
                , queryParameters,
                (err: any, rowsClient: any) => {
                    if (err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        callBack({ result: ResultCode.OK, message: 'OK', data: rowsClient });
                    }
                });
        } else {
            queryParameters.push('%' + phone + '%');
            let query = `SELECT c.* FROM customer c INNER JOIN item_queue iq ON c.id = iq.idCustomer 
                                WHERE ${queryConditions} AND c.id IN 
                                        (SELECT idCustomer FROM customer_phone WHERE phone LIKE ?)`;
            console.log(query);
            con.query(query, queryParameters,
                (err: any, rowsClient: any) => {
                    if (err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        callBack({ result: ResultCode.OK, message: 'OK', data: rowsClient });
                    }
                });
        }
    }

    findAllCustomer(name: string, lastname: string, ci: string, phone: string, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        let queryConditions = "";
        let queryParameters = [];
        if (name) {
            queryConditions += " names LIKE ? ";
            queryParameters.push('%' + name + '%');
        }
        if (lastname) {
            if (queryParameters.length > 0) {
                queryConditions += " AND ";
            }
            queryConditions += "lastnames LIKE ?";
            queryParameters.push('%' + lastname + '%');
        }
        if (ci) {
            if (queryParameters.length > 0) {
                queryConditions += " AND ";
            }
            queryConditions += "ci LIKE ? ";
            queryParameters.push('%' + ci + '%');
        }

        if (phone == "" || phone === undefined) {
            let query = `SELECT c.* FROM customer c
                            WHERE ${queryConditions}`;

            console.log(query);
            con.query(query, queryParameters,
                (err: any, rowsClient: any) => {
                    if (err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        callBack({ result: ResultCode.OK, message: 'OK', data: rowsClient });
                    }
                });
        } else {
            if (queryParameters.length > 0) {
                queryConditions += " AND ";
            }
            queryParameters.push('%' + phone + '%');
            let query = `SELECT c.* FROM customer c 
                             WHERE ${queryConditions} c.id IN 
                                (SELECT idCustomer FROM customer_phone WHERE phone LIKE ?)`;
            console.log(query);
            con.query(query, queryParameters,
                (err: any, rowsClient: any) => {
                    if (err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        callBack({ result: ResultCode.OK, message: 'OK', data: rowsClient });
                    }
                });
        }
    }

    getAll(dbName: string, callBack: (r: ResultWithData<Customer[]>) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection((err: any, con: any) => {
            if (!!err) {
                this.errorModel(con, err, callBack);
            } else {
                const QUERY: string = 'SELECT * FROM customer';
                con.query(QUERY, (err: any, result: any[]) => {
                    console.error(new Date(), err);
                    con.release();
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
        });
    }

    filterCustomers(filters: string[], negatedFilters: string[][], joins: string[], dbName: string, callBack: (r: ResultWithData<number>) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection((err: any, con: any) => {
            if (!!err) {
                this.errorModel(con, err, callBack);
            } else {

                let sqlFilter = _.map(negatedFilters, nfs => ' NOT ( ' + _.join(nfs, ' OR ') + ' ) ')
                    .concat(' ( ' + _.join(filters, ' OR ') + ' ) ')
                    .join(' AND ');
                let sqlJoin = _.join(_.map(joins, j => 'INNER JOIN ' + j), '');

                const QUERY: string = 'SELECT COUNT(*) as count FROM customer ' +
                    (sqlJoin && sqlJoin.length > 0 ? sqlJoin : ' ') +
                    (sqlFilter && sqlFilter.length > 0 ? ' WHERE ' + sqlFilter : '');
                con.query(QUERY, (err: any, result: { count: number }[]) => {
                    if (!!err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        con.release();
                        callBack({
                            result: ResultCode.OK,
                            message: 'OK',
                            data: result[0].count
                        });
                    }
                });
            }
        });
    }

    // processFilters(filters: FilterStep[], usersIds: number[], dbName: string, callback: (r: ResultWithData<number>) => void): void {
    // var pool = this.controllerConnections.getUserConnection(dbName);
    // pool.getConnection((err: any, con: any) => {
    //     if (!!err) {
    //         this.errorModel(con, err, callback);
    //     } else {
    //         con.beginTransaction(function (err: any) {
    //             const INIT_QUERY: string = ' UPDATE item_queue ' +
    //                 ' INNER JOIN queue_user ON item_queue.idQueue = queue_user.idQueue ' +
    //                 ' SET itemOrder = 999, called = 0 ' +
    //                 ' WHERE queue_user.idUser IN ( ' + usersIds.join(',') + ' ) ';
    //             con.query(INIT_QUERY, (err: any, result: { count: number }[]) => {
    //                 if (!!err) {
    //                     console.log(err);
    //                     con.release();
    //                     callback({ result: ResultCode.Error, message: "Error interno." });
    //                 } else {
    //                     var querysFn = _.map(filters, (filter: StepFilter, index: number, filters: StepFilter[]): ((c: any) => void) => {
    //                         return (parallelCallback) => {
    //                             let negatedFilters = _.take(filters, index).map(f => f.filters);
    //                             let sqlFilter = _.map(negatedFilters, nfs => ' NOT ( ' + _.join(nfs, ' OR ') + ' ) ')
    //                                 .concat(' ( ' + _.join(filter.filters, ' OR ') + ' ) ')
    //                                 .join(' AND ');
    //                             let sqlJoin = _.join(_.map(_.take(filters, index + 1).filter(f => f.join).map(f => f.join), j => 'INNER JOIN ' + j), '');

    //                             const SELECT_QUERY: string = ' SELECT customer.id FROM customer ' +
    //                                 (sqlJoin && sqlJoin.length > 0 ? sqlJoin : ' ') +
    //                                 ' INNER JOIN item_queue ON item_queue.idCustomer = customer.id ' +
    //                                 ' INNER JOIN queue_user ON queue_user.idQueue = item_queue.idQueue ' +
    //                                 ' WHERE queue_user.idUser IN ( ' + usersIds.join(',') + ' ) ' +
    //                                 (sqlFilter && sqlFilter.length > 0 ? ' AND ' + sqlFilter : '');
    //                             con.query(SELECT_QUERY, (err: any, result: any[]) => {
    //                                 if (!!err) {
    //                                     parallelCallback({ result: ResultCode.Error, message: "Error del sistema al aplicar filtros." }, null);
    //                                 } else {
    //                                     if (result && result.length > 0) {
    //                                         const UPDATE_QUERY: string = ' UPDATE item_queue SET itemOrder = ' + index +
    //                                             ' WHERE idCustomer IN ( ' + result.map(c => c.id).join(',') + ' ) ';
    //                                         con.query(UPDATE_QUERY, (err: any, result: { count: number }[]) => {
    //                                             if (!!err) {
    //                                                 parallelCallback({ result: -1, message: "Error del sistema al aplicar filtros." }, null);
    //                                             } else {
    //                                                 parallelCallback(null, {
    //                                                     result: ResultCode.OK,
    //                                                     message: 'OK'
    //                                                 });
    //                                             }
    //                                         });
    //                                     } else {
    //                                         parallelCallback(null, {
    //                                             result: ResultCode.OK,
    //                                             message: 'OK. No se aplicaron filtros al agente debido a que no tenia ningun cliente que cumpliera los filtros'
    //                                         });
    //                                     }
    //                                 }
    //                             });
    //                         };
    //                     });
    //                     parallel(querysFn, (err: any, success: any) => {
    //                         con.commit(function (err: any) {
    //                             if (!!err) {
    //                                 con.rollback(function () {
    //                                     console.log(err);
    //                                     con.release();
    //                                     callback({ result: ResultCode.Error, message: "Error interno." });
    //                                 });
    //                             } else {
    //                                 con.release();
    //                                 callback({ result: ResultCode.OK, message: "OK" });
    //                             }
    //                         });
    //                     });

    //                 }
    //             });
    //         });
    //     }
    // });
    // }

    updatePhonesCustomer(customer: Customer, indexPhone: number, con: any, dbName: string, callBack: (r: ResultWithData<Customer[]>) => void): void {
        if (indexPhone < customer.phones.length) {
            var mainThis = this;
            const QUERY: string = 'INSERT INTO customer_phone (idCustomer,phone,position,active) VALUES (?,?,?,1)';
            let phone = customer.phones[indexPhone];
            if (phone !== "") {
                con.query(QUERY, [customer.id, phone, indexPhone],
                    function (err: any, result: any[]) {
                        if (!!err) {
                            con.rollback(function () {
                                mainThis.errorModel(con, err, callBack);
                            });
                        } else {
                            mainThis.updatePhonesCustomer(customer, indexPhone + 1, con, dbName, callBack);
                        }
                    });
            } else {
                mainThis.updatePhonesCustomer(customer, indexPhone + 1, con, dbName, callBack);
            }
        } else {
            con.commit(function (err: any) {
                if (err) {
                    mainThis.errorModel(con, err, callBack);
                }
                con.release();
                callBack({
                    result: ResultCode.OK,
                    message: 'OK'
                });

            });
        }
    }


    addPhonesCustomer(customer: Customer, indexPhone: number, con: any, dbName: string, callBack: (r: ResultWithData<Customer[]>) => void): void {
        if (indexPhone < customer.phones.length) {
            var mainThis = this;
            const QUERY: string = 'INSERT INTO customer_phone (idCustomer,phone,position,active) VALUES (?,?,?,1)';
            let phone = customer.phones[indexPhone];
            if (phone !== "") {
                con.query(QUERY, [customer.id, phone, indexPhone],
                    function (err: any, result: any[]) {
                        if (!!err) {
                            con.rollback(function () {
                                mainThis.errorModel(con, err, callBack);
                            });
                        } else {
                            mainThis.addPhonesCustomer(customer, indexPhone + 1, con, dbName, callBack);
                        }
                    });
            } else {
                mainThis.addPhonesCustomer(customer, indexPhone + 1, con, dbName, callBack);
            }
        } else {
            con.commit(function (err: any) {
                if (err) {
                    mainThis.errorModel(con, err, callBack);
                }
                con.release();
                callBack({
                    result: ResultCode.OK,
                    message: 'OK'
                });

            });
        }
    }

    customerDebt(idCustomer: number, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        const QUERY: string = 'SELECT * FROM customer_debt WHERE idCustomer = ? ';
        con.query(QUERY, [idCustomer],
            (err: any, result: any[]) => {
                if (!!err) {
                    this.errorModel(con, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: 'OK', data: result });
                }
            });
    }

    customerPayments(idCustomer: number, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        const QUERY: string = 'SELECT * FROM customer_payment WHERE idCustomer = ? ORDER BY currentFee DESC';
        con.query(QUERY, [idCustomer],
            (err: any, result: any[]) => {
                if (!!err) {
                    this.errorModel(con, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: 'OK', data: result });
                }
            });
    }

    customerAgreement(idCustomer: number, con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        const QUERY: string = 'SELECT * FROM customer_agreement WHERE idCustomer = ? ORDER BY currentFee DESC';
        con.query(QUERY, [idCustomer],
            (err: any, result: any[]) => {
                if (!!err) {
                    this.errorModel(con, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: 'OK', data: result });
                }
            });
    }



    getCareers(con: any, callBack: (r: ResultWithData<Customer[]>) => void): void {
        const QUERY: string = 'SELECT * FROM career ';
        con.query(QUERY,
            (err: any, result: any[]) => {
                if (!!err) {
                    this.errorModel(con, err, callBack);
                } else {
                    callBack({ result: ResultCode.OK, message: 'OK', data: result });
                }
            });
    }


    // Modificaciones masivas con promise

    // todo arreglar el tipo de retorno
    public async getCustomerIdByCIPromise(ci: string, conn: IQueryablePromiseConnection): Promise<any> {
        const query: string = "SELECT id FROM customer WHERE ci = ? LIMIT 1"
        try {
            const results = await conn.query(query, [ci]);
            return results && results.length > 0 ? results[0].id : undefined;
        } catch (reason) {
            await this.errorHandlerWithPromise(conn, reason);
            return Promise.reject(reason);
        }
    }

    /**
     * 
     * @param idCustomer 
     * @param idCampaign 
     * @param idUser 
     * @param conn 
     */
    public async assignCustomerCampaign(idCustomer: number, idCampaign: number, idUser: number,
        conn: IQueryablePromiseConnection): Promise<any> {
        const queryCampaign = "INSERT INTO customer_campaign(idCustomer,idCampaign,date,idUser) VALUE (?,?,NOW(),?)";

        try {
            const results = await conn.query(queryCampaign, [idCustomer, idCampaign, idUser]);
            return results && results.length > 0 ? results[0] : undefined;
        } catch (reason) {
            await this.errorHandlerWithPromise(conn, reason);
            return Promise.reject(reason);
        }
    }


    /**
     * 
     * @param idCustomer 
     * @param conn 
     */
    public async cleanCustomerCampaignByCustomer(idCustomer: number,
        conn: IQueryablePromiseConnection): Promise<any> {
        const queryCampaign = "DELETE FROM customer_campaign WHERE idCustomer = ?";

        try {
            const results = await conn.query(queryCampaign, [idCustomer]);
            return results && results.affectedRows > 0;
        } catch (reason) {
            await this.errorHandlerWithPromise(conn, reason);
            return Promise.reject(reason);
        }
    }


    /**
     * 
     * @param idQueue 
     * @param idCustomer 
     * @param conn 
     */
    public async updateCustomerQueue(idQueue: number, idCustomer: number,
        conn: IQueryablePromiseConnection): Promise<any> {
        const queryQueue = "UPDATE item_queue SET idQueue = ? WHERE idCustomer = ?";

        try {
            const results = await conn.query(queryQueue, [idQueue, idCustomer]);
            return results && results.affectedRows > 0;
        } catch (reason) {
            await this.errorHandlerWithPromise(conn, reason);
            return Promise.reject(reason);
        }
    }

    /**
     * 
     * @param idQueue 
     * @param idCustomer 
     * @param conn 
     */
    public async addCustomerQueue(idQueue: number, idCustomer: number,
        conn: IQueryablePromiseConnection): Promise<any> {
        const queryQueue = "INSERT INTO item_queue (idQueue,idCustomer,itemOrder,status) values (?,?,999,'withoutCalling')";

        try {
            const results = await conn.query(queryQueue, [idQueue, idCustomer]);
            return results && results.affectedRows > 0;
        } catch (reason) {
            await this.errorHandlerWithPromise(conn, reason);
            return Promise.reject(reason);
        }
    }

    /**
     * 
     * @param idCustomer 
     * @param idCampaign 
     * @param idUser 
     * @param conn 
     */
    public async logMassiveUpdateStart(idUser: number, type: string, countOK: number, countError: number,
        conn: IQueryablePromiseConnection): Promise<any> {
        const queryCampaign = "INSERT INTO log_massive_update(idUser,type,countOK,countError) VALUE (?,?,?,?)";

        try {
            const results = await conn.query(queryCampaign, [idUser, type, countOK, countError]);
            return results ? results.insertId : undefined;
        } catch (reason) {
            await this.errorHandlerWithPromise(conn, reason);
            return Promise.reject(reason);
        }
    }

    /**
     * 
     * @param idCustomer 
     * @param idCampaign 
     * @param idUser 
     * @param conn 
     */
    public async logMassiveUpdateEnd(idLog: number, countOK: number, countError: number,
        conn: IQueryablePromiseConnection): Promise<any> {
        const queryCampaign = "UPDATE log_massive_update SET countOK = ? ,countError = ? WHERE id = ?";

        try {
            const results = await conn.query(queryCampaign, [countOK, countError, idLog]);
            return results && results.length > 0 ? results[0] : undefined;
        } catch (reason) {
            await this.errorHandlerWithPromise(conn, reason);
            return Promise.reject(reason);
        }
    }

    /**
     * 
     * @param idCustomer 
     * @param idCampaign 
     * @param idUser 
     * @param conn 
     */
    public async logMassiveData(idLog: number, conn: IQueryablePromiseConnection): Promise<any> {
        const queryCampaign = "SELECT * FROM log_massive_update WHERE id = ?";

        try {
            const results = await conn.query(queryCampaign, [idLog]);
            return results && results.length > 0 ? results[0] : undefined;
        } catch (reason) {
            await this.errorHandlerWithPromise(conn, reason);
            return Promise.reject(reason);
        }
    }

    /**
     * 
     * @param idCustomer 
     * @param idCampaign 
     * @param idUser 
     * @param conn 
     */
    public async errorLogMassive(idLog: number, error: string, conn: IQueryablePromiseConnection): Promise<any> {
        const queryCampaign = "INSERT INTO log_error_massive_update(idLog,error) VALUES (?,?) ";

        try {
            const results = await conn.query(queryCampaign, [idLog, error]);
            return results ? results.insertId : undefined;
        } catch (reason) {
            await this.errorHandlerWithPromise(conn, reason);
            return Promise.reject(reason);
        }
    }

}