import * as express from 'express';
import { ResultCode } from '../../../datatypes/result';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { UserModel } from '../models/userModel';
import { MainController } from './mainController';
var sha1 = require('sha1');

export class AuthenticateController extends MainController {
    private usersModel: UserModel;
    private resource: string;
    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        this.resource = "users";
        this.usersModel = new UserModel(controllerConnections);
    }

    private getIP(req: any): string {
        let clientIp: any = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

        if (Array.isArray(clientIp)) {
            clientIp = clientIp[0];
        } else {
            clientIp = clientIp ? clientIp.split(',')[0] : '';
        }

        return clientIp;
    }

    private getIPsAllowed(): string[] {
        return ["200.108.253.229", "190.64.78.198", "200.40.68.26" ];
    }

    private isAllowed(req: any): boolean {
       //let clientIp: any = this.getIP(req);
       //let allowedIPs: string[] = this.getIPsAllowed();
       //return allowedIPs.indexOf(clientIp) > -1;
	return true;
    }

    public login = (req: express.Request, res: express.Response): void => {
        this.masterDBController.login(req.body.user, req.body.pass, false, (err: any, loginresponse: any) => {
            if (err) {
                console.error(new Date().toString(), " => err =>", err);
                res.send({ result: ResultCode.Error, message: "Error interno." });
            } else { // existPreviousLogout
                if (loginresponse.result === true) {
                    this.masterDBController.verifySession(loginresponse.user.userName, loginresponse.tokenId,
                        loginresponse.accounts[0].id, (err: any, authError: any, response: any, dbName: string) => {
                            this.usersModel.userByIdMaster(loginresponse.user.id, loginresponse.tokenId,
                                loginresponse.user.userName, loginresponse.user.rolId, loginresponse.accounts[0].id, dbName, (response: any) => {
                                    if (response.result == ResultCode.OK) {
                                        this.getPool(dbName, (con) => {
                                            let clientIp: any = this.getIP(req);
                                            let allowed = this.isAllowed(req);
                                            let withoutPhone = response.data.withoutPhone;
                                            if (withoutPhone || allowed) {
                                                // if there isn't previous logout entry -> add it
                                                if (!loginresponse.existPreviousLogout && loginresponse.previousSession) {
                                                    const LOGIN = false;
                                                    const LOGOUT_AGENT = 0;
                                                    this.usersModel.addUserSessionEntryWithDate(loginresponse.previousSession.timestamp, response.data.id, LOGIN, LOGOUT_AGENT, clientIp, con, (result2: any) => {
                                                        const LOGIN = true;
                                                        this.usersModel.addUserSessionEntry(response.data.id, LOGIN, req.body.agent, clientIp, con, (result2: any) => {
                                                            res.send(response);
                                                        });
                                                    });
                                                } else {
                                                    const LOGIN = true;
                                                    this.usersModel.addUserSessionEntry(response.data.id, LOGIN, req.body.agent, clientIp, con, (result2: any) => {
                                                        res.send(response);
                                                    });
                                                }
                                            } else {
                                                res.send({
                                                    result: ResultCode.Error,
                                                    message: "Acceso restringido"
                                                });
                                            }
                                        });
                                    } else {
                                        res.send({
                                            result: ResultCode.Error,
                                            message: "No se encontro el usuario"
                                        });
                                    }
                                });
                        });
                } else {
                    res.send({
                        result: ResultCode.Error,
                        message: this.formatMessage(loginresponse.message)
                    });
                }
            }
        });
    }

    public cleanSessions = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.masterDBController.getMasterConnection().
                getConnection().
                query("SELECT * FROM master_stmotion.sessions WHERE timestamp < DATE_SUB(NOW(), INTERVAL 1 HOUR)",
                    (err: any, result: any) => {
                        if (err) {
                            res.send({ result: ResultCode.Error, message: 'Error', data: err });
                        } else {
                            //user_id
                            this.getPool(dbName, (con) => {
                                this.cleanOldSessions(result, 0, res, con, dbName)
                            });
                        }
                    });
        });
    }


    private cleanOldSessions(sessions: any[], index: number, res: any, con: any, dbName: string): void {
        if (index < sessions.length) {
            let session = sessions[index];
            this.closeSessionByUser(false, session.user_name, session.account_id, "", 0, res, session.timestamp, dbName, (r: any) => {
                this.cleanOldSessions(sessions, index + 1, res, con, dbName);
            });
        } else {
            res.send({
                result: ResultCode.OK,
                message: 'Se limpiaron las sessiones correctamente'
            });
        }
    }



    public changePasswordAndLogin = (req: express.Request, res: express.Response): void => {
        this.masterDBController.login(req.body.user, req.body.pass, true, (err: any, loginresponse: any) => {
            if (err !== null) {
                var now = new Date();
                console.error(now.toString(), " => err =>", err);
                res.send({ result: ResultCode.Error, message: "Error interno." });
            } else {
                if (loginresponse.result === true) {
                    this.masterDBController.verifySession(loginresponse.user.userName, loginresponse.tokenId,
                        loginresponse.accounts[0].id, (err: any, authError: any, response: any, dbName: string) => {

                            this.masterDBController.getMasterConnection().
                                getConnection().
                                query("UPDATE users SET requireNewPassword = 0, password = ? WHERE user_name = ? && password = ?",
                                    [sha1(req.body.newPass.trim()), req.body.user.trim(), sha1(req.body.pass.trim())],
                                    (err: any, rols: any) => {
                                        if (err) {
                                            res.send({ result: ResultCode.Error, message: 'Error', data: err });
                                        } else {
                                            this.usersModel.userByIdMaster(loginresponse.user.id, loginresponse.tokenId,
                                                loginresponse.user.userName, loginresponse.user.rolId, loginresponse.accounts[0].id, dbName, (response: any) => {
                                                    if (response.result == ResultCode.OK) {
                                                        const LOGIN = true;
                                                        this.getPool(dbName, (con) => {
                                                            this.usersModel.addUserSessionEntry(response.data.id, LOGIN, req.body.agent, '', con, (result2: any) => {
                                                                res.send(response);
                                                            });
                                                        });
                                                    } else {
                                                        res.send({ result: ResultCode.Error, message: "No se encontro el usuario" });
                                                    }
                                                });
                                        }
                                    });
                        });
                } else {
                    res.send({
                        result: ResultCode.Error,
                        message: this.formatMessage(loginresponse.message)
                    });
                }
            }
        });
    }

    public verifyToken = (req: express.Request, res: express.Response): void => {
        this.masterDBController.verifySession(<string>req.headers['user'], <string>req.headers['tokenid'], parseInt(<string>req.headers['accountid']),
            (err: any, authError: any, response: any, dbName: string) => {
                res.send({ result: !err && !authError });
            }
        );
    }

    public closeSession = (req: express.Request, res: express.Response): void => {
        let user = <string>req.headers['user'];
        let tokenId = <string>req.headers['tokenid'];
        let accountId = parseInt(<string>req.headers['accountid']);

        this.masterDBController.verifySession(user, tokenId, accountId, (err: any, authError: any, response: any, dbName: string) => {
            this.closeSessionByUser(true, user, accountId, tokenId, req.params.agent, res, new Date(), dbName, (closeResponse: any) => {
                res.send(closeResponse);
            });
        });
    }

    //TODO generalizar 
    private closeSessionByUser(currentUser: boolean, user: string, accountId: number, tokenId: string,
        agent: number, res: express.Response, date: Date,
        dbName: string, callBack: (r: any) => void): void {
        if (currentUser) {
            this.masterDBController.logout(user, accountId, tokenId, (err: any, closeResponse: any) => {
                if (closeResponse !== false) {
                    this.getPool(dbName, (con) => {
                        this.usersModel.getUserByUsername(user, con, (response: any) => {
                            if (response.result > 0) {
                                let userId: number = response.data[0].id;
                                this.usersModel.addUserSessionEntry(userId, false, agent, '', con, (result2: any) => {
                                    callBack({
                                        result: closeResponse !== false
                                    });

                                });
                            } else {
                                callBack({
                                    result: ResultCode.Error,
                                    message: 'Usuario no existe o no esta logeado'
                                });
                            }
                        });
                    });
                } else {
                    callBack({ result: closeResponse !== false });
                }
            });
        } else {
            this.masterDBController.deleteSession(user, accountId, (err: any, closeResponse: any) => {
                if (closeResponse !== false) {
                    this.getPool(dbName, (con) => {
                        this.usersModel.getUserByUsername(user, con, (response: any) => {
                            if (response.result > 0 && response.data && response.data.length > 0) {
                                let userId: number = response.data[0].id;
                                // TODO poner ip real
                                this.usersModel.addUserSessionEntryWithDate(date, userId, false, agent, '', con, (result2: any) => {
                                    callBack({
                                        result: closeResponse !== false
                                    });
                                });
                            } else {
                                callBack({
                                    result: ResultCode.Error,
                                    message: 'Usuario no existe o no esta logeado'
                                });
                            }
                        });
                    });
                } else {
                    callBack({ result: closeResponse !== false });
                }
            });
        }
    }



    private formatMessage(messageCode: string): string {
        if (messageCode === "User inactive") {
            return "Usuario inactivo";
        } else if (messageCode === "user blocked") {
            return "Usuario bloqueado";
        } else if (messageCode === "Require new password") {
            return "Por favor, actualize su contraseña";
        } else {
            return "Usuario o clave incorrecta";
        }
    }
}
