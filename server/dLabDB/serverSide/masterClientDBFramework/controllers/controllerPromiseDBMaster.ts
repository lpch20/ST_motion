
var dbUsersBuilder = require('../db/dbUsers');
var dbSessionsBuilder = require('../db/dbSessions');

import { ZenouraMysqlPromiseConnection } from '../../mysql/mysqlPromiseConnection'
import { MasterDatabasePromiseConnection } from '../db/MasterDatabasePromiseConnection';

export class ControllerDBPromiseMaster {
    private host: string;
    private port: number;
    private user: string;
    private password: string;
    private connectionPool: Array<any>;
    private zenouraMysql: ZenouraMysqlPromiseConnection;
    private dbUsers: any;
    private dbSessions: any;
    private dbMasterConnection: MasterDatabasePromiseConnection;

    constructor(host: string, port: number, databaseName: string, userDB: string, passwordDB: string, usersDbModelMap: any) {
        console.log('init creation of  framework client db controller.');
        this.host = host;
        this.port = port;
        this.user = userDB;
        this.password = passwordDB;
        this.connectionPool = [];
        this.zenouraMysql = new ZenouraMysqlPromiseConnection();

        this.dbMasterConnection = new MasterDatabasePromiseConnection(host, port, databaseName, this.user, this.password);

        this.dbUsers = new dbUsersBuilder(usersDbModelMap, this.dbMasterConnection);
        this.dbSessions = new dbSessionsBuilder(this.dbMasterConnection);
    }

    public getUserConnection(databaseName: any): any {
        if (this.connectionPool[databaseName] && this.connectionPool[databaseName] !== undefined) {
            return this.connectionPool[databaseName];
        } else {
            var connection = this.zenouraMysql.establishPromiseConnection(this.host, this.port, databaseName, this.user, this.password);
            console.log(this.host);
            console.log(this.port);
            console.log(databaseName);
            this.connectionPool[databaseName] = connection;
            return connection;
        }
    };

    public getMasterConnection(): MasterDatabasePromiseConnection {
        return this.dbMasterConnection;
    }

    public verifySession(user: string, tokenId: string, accountId: number, callback: any) {
        this.dbSessions.verifySession(user, tokenId, accountId,
            (err: any, authError: any, result: any, client_database_name: string, last_activity: Date) => {
                let response: boolean;
                if (err) {
                    response = false;
                } else if (!result) {
                    err = 'invalid session';
                    response = false;
                } else if (this.isSessionExpired(last_activity)) {
                    err = 'session expired';
                    response = false;
                } else {
                    err = null;
                    response = true;
                }

                if (!response && err == 'session expired') {
                    this.logout(user, accountId, tokenId, () => {
                        callback(err, authError, response);
                    });
                } else {
                    this.dbSessions.updateSessionTimestamp(user, tokenId, accountId, (err2: any) => {
                        callback(err, authError, response, client_database_name);
                    });
                }
            }
        );
    };

    public logout(user: string, accountId: number, tokenId: string, callback: any) {
        this.dbSessions.verifySession(user, tokenId, accountId, (err: any, authError: any, result: any) => {
            if (err) {
                callback(err, false);
                return;
            } else if (authError) {
                callback('invalid session', false);
                return;
            } else if (!result) {
                callback('internal error', false);
                return;
            } else {
                this.dbSessions.deleteSession(user, accountId, (err: any) => {
                    if (err) {
                        callback(err);
                        return;
                    } else {
                        callback(null, err);
                        return;
                    }
                });
            }
        }
        );
    };


    public deleteSession(user: string, accountId: number, callback: any): void {
        this.dbSessions.deleteSession(user, accountId, (err: any) => {
            if (err) {
                callback(err);
                return;
            } else {
                callback(null, err);
                return;
            }
        });
    }


    public login(user: string, password: string, changePass = false, callback: any) {

        var dbSessionAux = this.dbSessions;
        this.dbUsers.login(user, password, changePass, function (err: any, loginResponse: any) {
            if ((loginResponse) && (loginResponse.result)) {
                dbSessionAux.createSession(loginResponse, function (err: any, loginResponseSession: any) {
                    if (err)
                        callback(err, loginResponseSession)
                    else
                        callback(null, loginResponseSession);
                });
            } else {
                callback(err, loginResponse);
            }
        });
    };

    public updateState(userId: string, state: string, accountId: string, callBack: any, callBackError: any) {
        this.dbUsers.updateState(userId, state, accountId, function (err: any, updateStateResponse: any) {
            if ((updateStateResponse) && (updateStateResponse.result)) {
                callBack(null, updateStateResponse);
            } else {
                callBack(err, updateStateResponse);
            }
        }, function (result: any) {
            callBackError(result);
        });
    };

    private isSessionExpired(date: Date): boolean {
        const MAX_SESSION_TIME = 60;

        var milliseconds = Math.abs(<any>new Date() - <any>date);
        return milliseconds / 1000 / 60 > MAX_SESSION_TIME;
    }
}