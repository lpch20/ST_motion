import { ResultWithData, ResultCode } from '../../../datatypes/result';
import { MainModel } from './mainModel';
import { CallHistory } from '../../../datatypes/callHistory';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';

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
     addCallHistoryByIpContact(callHistory: CallHistory , con: any, callBack: (r: any) => void): void {
            con.getConnection((err: any, con: any) => {
                if (err) {
                    this.errorModel(con, err, callBack);
                } else {
                   
                    if (callHistory.callId==null || callHistory.callId.length==0)
                    { 
                        callBack({
                            result: ResultCode.Error,
                            message: "FAIL",
                            data: {
                                mensaje: "callId no puede ser null"
                            }
                        });
                    }
                
                    const QUERY_FIND = 'select * from call_history where callId = ?';
                
                    con.query(QUERY_FIND, [callHistory.callId], (err: any, result: any) => {
                        if (err) {
                            this.errorModel(con, err, callBack);
                        } else {
                            

                            if (result.length > 0) {
                                callBack({
                                    result: ResultCode.Error,
                                    message: "FAIL",
                                    data: {
                                        mensaje: "LLAMADA REGISTRADA"
                                    }
                                });
                            }
                            else{

                                const QUERY = 'INSERT INTO call_history (start,end,customerId,callId,totalTime,source,Destination,status) VALUES (?,?,?,?,?,?,?,?)';
                                con.query(QUERY, [callHistory.start, callHistory.end, callHistory.customerId,callHistory.callId ,callHistory.totalTime,callHistory.source, callHistory.destination , callHistory.status ], (err: any, result: any) => {
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
     getLastCallByCustomer(customerId: string , con: any, callBack: (r: any) => void): void {
        con.getConnection((err: any, con: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
               
                if (customerId==null || customerId.length==0)
                { 
                    callBack({
                        result: ResultCode.Error,
                        message: "FAIL",
                        data: {
                            mensaje: "customerId no puede ser null"
                        }
                    });
                }
            
                const QUERY_FIND = 'SELECT * FROM master_stmotion.call_history ch where ch.status=2 and customerId = ? and ch.end between NOW() - INTERVAL 10 minute and NOW() + INTERVAL 10 minute  order by id desc limit 1';
            
                con.query(QUERY_FIND, [customerId], (err: any, result: any) => {
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
                        else{
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
});
}
}
