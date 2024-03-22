import { Result, ResultWithData, ResultCode } from '../../../datatypes/result';
import { MainModel } from './mainModel';
import { IQueryableConnection } from '../controllers/mainController';
import { Call } from '../../../datatypes/call';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';

export class CallModel extends MainModel {

    constructor(private controllerConnections: ControllerDBClientsConnections) {
        super();
    }

    /**
     * 
     * @param idUser {number} Usuario autenticado
     * @param idCustomer 
     * @param origin {string} Telefono origen
     * @param tel {string} Telefono destino
     * @param date 
     * @param url {string} Url que se invoco para hacer la llamada
     * @param type {number} indica si fue un evento de salida o de respuesta
     * @param response {string} respuesta de la llamada
     * @param dbName
     * @param callback 
     */
    add(idUser: number, idCustomer: number, origin: string, tel: string, url: string, type: number, response: string, dbName: string, callback: (r: Result) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection((err: any, con: any) => {
            if (err) {
                this.errorModel(con, err, callback);
            } else {
                let QUERY: string = 'INSERT INTO calls(idUser, idCustomer,origin, tel, date,url,type,response) VALUES(?,?,?,?,NOW(),?,?,?)';

                con.query(QUERY, [idUser, idCustomer, origin, tel, url, type, response], super.errorHandlerGeneric<{ a_: any }[]>(con, callback, (filterProgress) => {
                    con.release();
                    callback({ result: ResultCode.OK, message: 'OK' });
                }));
            }
        });
    }

    /**
     * Obtiene la ultima llamada realizada por el usuario y destino especificado
     * @param idUser Identificador de usuario
     * @param origin Destino de la llamada
     * @param dbName Nombre de la base de datos
     * @param callback Callback
     */
    getLastCall(idUser: number, origin: string, conn: IQueryableConnection, callback: (r: ResultWithData<Call>) => void): void {
        let QUERY: string = `SELECT *
                             FROM calls
                             WHERE idUser = ? AND origin = ?
                             ORDER BY date DESC
                             LIMIT 1`;
        conn.query(QUERY, [idUser, origin], (err: any, result: Call[]) => {
            if (err) {
                this.errorModel(conn, err, callback, 'Error obteniendo la llamada');
            } else {
                callback({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result && result.length > 0 ? result[0] : undefined
                });
            }
        });
    }
}
