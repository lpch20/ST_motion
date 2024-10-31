import { CallHistory } from '../../../datatypes/callHistory';
import { InitCall } from '../../../datatypes/initCall';
import { ResultCode, ResultWithData } from '../../../datatypes/result';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { MainModel } from './mainModel';

export class ParameterModel extends MainModel {
    constructor(private controllerConnections: ControllerDBClientsConnections) {
        super();
    }

    getAll(dbName: string, callBack: (r: ResultWithData<any[]>) => void): void {

        const pool = this.controllerConnections.getUserConnection(dbName);
        const QUERY: string = 'SELECT * FROM parameters';
        pool.query(QUERY, (err: any, result: any[]) => {
            if (!!err) {
                this.errorModel(pool, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result
                });
            }
        });
    }
    /**
    * 
    * @param start 
    * @param end 
    * @param customerId 
    * @param callId 
    * @param totalTime 
    * @param source 
    * @param Destination 
    * @param status 
    * @param con 
    */
    addCallHistoryByIpContact(callHistory: CallHistory, con: any, callBack: (r: any) => void): void {
        con.getConnection((err: any, con: any) => {
            if (err) {
                con.release();
                this.errorModel(con, err, callBack);
            } else {

                if (callHistory.callId == null || callHistory.callId.length == 0) {
                    callBack({
                        result: ResultCode.Error,
                        message: "FAIL",
                        data: {
                            mensaje: "callId no puede ser null"
                        }
                    });
                }



                const QUERY = 'INSERT INTO call_history (start,end,customerId,callId,totalTime,source,Destination,status) VALUES (?,?,?,?,?,?,?,?)';
                con.query(QUERY, [callHistory.start, callHistory.end, callHistory.customerId, callHistory.callId, callHistory.totalTime, callHistory.source, callHistory.destination, callHistory.status], (err: any, result: any) => {
                    if (err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        con.release();
                        callBack({
                            result: ResultCode.OK,
                            message: "OK",
                            data: result
                        });
                    }
                });


            }
        });
    }
    /**
       * 
       * @param start 
        * @param customerId 
       * @param source 
       * @param Destination 
      * @param con 
       */
    addCallByIpContact(InitCall: InitCall, con: any, callBack: (r: any) => void): void {
        con.getConnection((err: any, con: any) => {
            if (err) {
                con.release();
                this.errorModel(con, err, callBack);
            } else {

                if (InitCall.destination == null || InitCall.destination.length == 0) {
                    callBack({
                        result: ResultCode.Error,
                        message: "FAIL",
                        data: {
                            mensaje: "callId no puede ser null"
                        }
                    });
                }

                if (InitCall.customerId == null || InitCall.customerId.length == 0) {
                    callBack({
                        result: ResultCode.Error,
                        message: "FAIL",
                        data: {
                            mensaje: "customerId no puede ser null"
                        }
                    });
                }



                const QUERY = 'INSERT INTO call_init (start,customerId,source,Destination) VALUES (?,?,?,?)';
                con.query(QUERY, [InitCall.start, InitCall.customerId, InitCall.source, InitCall.destination], (err: any, result: any) => {
                    if (err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        con.release();
                        callBack({
                            result: ResultCode.OK,
                            message: "OK",
                            data: result
                        });
                    }
                });


            }
        });
    }
    /**
   * 
   * @param customerId
   * @param destination
   * @param con 
   */
    getLastCallByCustomer(customerId: string, phone: string, totalTime: number, con: any, callBack: (r: any) => void): void {
        con.getConnection((err: any, con: any) => {
            if (err) {
                con.release();
                this.errorModel(con, err, callBack);
            } else {

                if (customerId == null || customerId.length == 0) {
                    callBack({
                        result: ResultCode.Error,
                        message: "FAIL",
                        data: {
                            mensaje: "customerId no puede ser null"
                        }
                    });
                }
                if (phone == null || phone.length == 0) {
                    callBack({
                        result: ResultCode.Error,
                        message: "FAIL",
                        data: {
                            mensaje: "phone no puede ser null"
                        }
                    });
                }
                else {

                    const QUERY_FIND = 'SELECT * FROM master_stmotion.call_history_st ch where ch.status=0 and customerId = ?  and destination = ? and ch.end between NOW() - INTERVAL 40 minute and NOW() + INTERVAL 40 minute and totalTime > ? order by id desc limit 1';



                    con.query(QUERY_FIND, [customerId, phone, totalTime], (err: any, result: any) => {
                        if (err) {
                            this.errorModel(con, err, callBack);
                        } else {


                            if (result.length > 0) {
                                con.release();
                                callBack({
                                    result: ResultCode.OK,
                                    message: "OK",
                                    data: result
                                });
                            }
                            else {
                                con.release();
                                callBack({
                                    result: ResultCode.Error,
                                    message: "FAIL",
                                    data: {
                                        mensaje: "NO SE ENCUENTRA REGISTRO"
                                    }
                                });



                            }




                        }
                    });

                }

            }
        });
    }




    /**
   * 
   * 
   * @param Telephone 
   * @returns phone,extension
   */
    getAgentByTelephone(Telephone: string, callBack: (r: any) => void): void {

        const dbNameMora: string = "requiro_moratemprana";
        var mainThis = this;


        if (Telephone.length > 0) {

            const pool = this.controllerConnections.getUserConnection(dbNameMora);
            pool.getConnection(function (err: any, con: any) {

                const VALUES = [
                    Telephone,
                    Telephone,
                    Telephone
                ];
                const QUERY: string = `SELECT phone,extension,created FROM requiro_moratemprana.customer_events
                where phone=? and created between NOW() - INTERVAL 6 month and NOW()
                UNION ALL
                SELECT phone,extension,created FROM requiro_multiple3.customer_events
                where phone=? and created between NOW() - INTERVAL 6 month and NOW()
                UNION ALL SELECT phone,extension,created FROM requiro_test.customer_events
                where phone=? and created between NOW() - INTERVAL 6 month and NOW()
                order by created desc limit 1`;

                //CONSULTA EN TODAS LAS BD
                con.query(QUERY, VALUES, (err: any, result: any) => {
                    if (err) {
                        con.release();
                        mainThis.errorModel(con, err, callBack);
                    } else {

                        if (result.length > 0) {
                            con.release();
                            callBack({
                                result: ResultCode.OK,
                                message: "OK",
                                data: result
                            });
                        }
                        else {
                            con.release();
                            callBack({
                                result: ResultCode.Error,
                                message: "FAIL",
                                data: {
                                    mensaje: "NO SE ENCUENTRA REGISTRO"
                                }
                            });


                        }

                    }
                }); //Fin consulta mora
            }); //Fin primer conexion
        }
        else {
            callBack({
                result: ResultCode.Error,
                message: "FAIL",
                data: {
                    mensaje: "Telefono es obligatorio"
                }
            });
        }

    }
}