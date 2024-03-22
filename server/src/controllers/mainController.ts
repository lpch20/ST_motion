import * as express from 'express';
import moment from 'moment';
import { ResultCode } from '../../../datatypes/result';
// Promise
// import { ControllerDBPromiseMaster } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBMaster';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';



export class MainController {

    constructor(protected masterDBController: ControllerDBMaster,
        protected controllerConnections: ControllerDBClientsConnections,
        protected controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        protected acl: NewACL) { }

    protected getUser(req: express.Request): string {
        return <string>req.headers['user'];
    }
    protected getTokenId(req: express.Request): string {
        return <string>req.headers['tokenid'];
    }
    protected getAccountId(req: express.Request): number {
        return parseInt(<string>req.headers['accountid']);
    }

    protected verifyAccess(req: express.Request, res: express.Response, resource: string, callBack: (dbName: string) => void): void {
        let user: string = <string>req.headers['user'];
        let tokenId: string = <string>req.headers['tokenid'];
        let accountId: number = parseInt(<string>req.headers['accountid']);

        this.masterDBController.verifySession(user, tokenId, accountId, (err: any, authError: any, response: any, dbName: any) => {
            if (err || authError) {
                res.send({
                    result: ResultCode.Error,
                    message: "messages.UNVERIFIED_SESSION",
                    data: `Sesion no verificada para el usuario ${user}. Detalles: ${err} ${authError}`
                });
            } else {
                this.acl.getACL().isAllowed(user, resource, 'get', (err: any, response: any) => {
                    if (response) {
                        callBack(dbName);
                    } else {
                        res.send({
                            result: ResultCode.Error,
                            message: "messages.PERMISSION_DENIED",
                            data: 'res: ' + resource
                        });
                    }
                })
            }
        });
    }

    protected async verifyAccessWithPromise(user: string, tokenId: string, accountId: number, resource: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.masterDBController.verifySession(user, tokenId, accountId, (err: any, authError: any, response: any, dbName: any) => {
                if (err || authError) {
                    reject("messages.UNVERIFIED_SESSION");
                } else {
                    this.acl.getACL().isAllowed(user, resource, 'get', (err: any, response: any) => {
                        if (response) {
                            resolve(dbName);
                        } else {
                            reject("messages.PERMISSION_DENIED.");
                        }
                    })
                }
            });
        });
    }

    protected getPool(dbName: string, callBack: (pool: IQueryableConnection) => void): any {
        const pool = this.controllerConnections.getUserConnection(dbName);
        callBack(pool);
    }

    protected getConnection(dbName: string, res: any, callBack: (con: IQueryableConnection) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection((err: any, con: IConnection) => {
            if (err) {
                try {
                    console.error(new Date(), err);
                    this.tryReleaseConnection(con);
                } finally {
                    res.send({
                        result: ResultCode.Error,
                        message: "Error al crear la conexion"
                    });
                }
            } else {
                try {
                    callBack(con);
                } finally {
                    this.tryReleaseConnection(con);
                }
            }
        });
    }

    protected async getConnectionWithPromise(dbName: string): Promise<IPromiseConnection> {
        return new Promise<IPromiseConnection>((resolve, reject) => {
            var pool = this.controllerPromiseConnections.getUserConnection(dbName);

            pool.getConnection()
                .then((conn: IPromiseConnection) => {
                    resolve(conn);
                })
                .catch((err: any) => {
                    console.error(err);
                    const error = {
                        result: ResultCode.Error,
                        message: "Error al crear la conexion",
                        details: err
                    };
                    reject(error);
                });
        });
    }

    /**
     * En caso de que la conexion este abierta, la libera.
     * @param con Conexion de MySql
     */
    protected tryReleaseConnectionPromise(con: IPromiseConnection): boolean {
        if (con && con.connection.state === 'authenticated' && con.release) {
            con.release();
            return true;
        }
        return false;
    }

    /**
     * En caso de que la conexión este abierta, la libera.
     * @param con Conexión de MySql
     */
    private tryReleaseConnection(con: IConnection): boolean {
        if (con && con.state === 'authenticated' && con.release) {
            con.release();
            return true;
        }
        return false;
    }

    protected manage = (conn: IPromiseConnection, invocation: Promise<any>) => {
        return invocation.then(
            value => {
                this.tryReleaseConnectionPromise(<IPromiseConnection>conn);
                return Promise.resolve(value);
            },
            err => {
                this.tryReleaseConnectionPromise(<IPromiseConnection>conn);
                return Promise.reject(err);
            }
        );
    }

    protected catchError(req: express.Request, res: express.Response, wrappedFn: () => void): void {
        try {
            wrappedFn();
        }
        catch (err) {
            console.error(new Date() + ': ' + err);
            res.send({
                result: ResultCode.Error,
                message: "Error interno."
            });
        }
    }

    protected errorHandler(dbName: string, wrappedFn: () => void): void {
        try {
            wrappedFn();
        }
        catch (err) {
            // TODO: insertar en la base de datos
            console.error(new Date(), err);
        }
    }

    public calculateMinutesDiff(dateMax: Date, dateMin: Date): number {
        let total: number;
        let momentMax = moment(dateMax, "YYYY-MM-DDTHH:mm:ss.SSS'Z'");
        let momentMin = moment(dateMin, "YYYY-MM-DDTHH:mm:ss.SSS'Z'");
        total = momentMax.diff(momentMin, 'minutes');
        return total;
    }

    public calculateSecondsDiff(dateMax: Date, dateMin: Date): number {
        let total: number;
        let momentMax = moment(dateMax, "YYYY-MM-DDTHH:mm:ss.SSS'Z'");
        let momentMin = moment(dateMin, "YYYY-MM-DDTHH:mm:ss.SSS'Z'");
        total = momentMax.diff(momentMin, 'seconds');
        return total;
    }

    protected getMoraType(dbName: string): MoraType {
        switch (dbName) {
            case 'requiro_moratemprana':
                return MoraType.moraTemprana;
            case 'requiro_test':
                return MoraType.moraTardia;
            default:
                throw new Error(`No se puede obtener el tipo de mora segun DB '${dbName}'.`);
        }
    }
}

export enum MoraType {
    moraTemprana = 'moraTemprana',
    moraTardia = 'moraTardia'
}
export interface IReversibleConnection {
    rollback: any;
}

export interface IQueryableConnection {
    query: any;
}

export interface IReleasableConnection {
    release: () => void;
}

export interface IStatusConnection {
    state: string;
}

export interface IConnection extends IStatusConnection, IReleasableConnection, IQueryableConnection, IReversibleConnection {

}

export interface IQueryablePromiseConnection {
    query: (fn: any, values?: any[]) => Promise<any>;
}

export interface IPromiseConnection extends IReleasableConnection, IQueryablePromiseConnection, IReversibleConnection {
    connection: IConnection;
}
