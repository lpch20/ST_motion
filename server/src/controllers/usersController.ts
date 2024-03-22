var sha1 = require('sha1');
import * as express from 'express';
import formidable from 'formidable';
import path from 'path';
import { Role } from '../../../datatypes/enums';
import { ResultCode, ResultWithData } from '../../../datatypes/result';
import { User } from '../../../datatypes/user';
import { ControllerDBClientsPromiseConnections } from '../../dLabDB/serverSide/masterClientDBFramework/controllers/controllerPromiseDBClient';
import { NewACL } from '../../motionLibJS/serverSide/acl/newACL';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { ControllerDBMaster } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBMaster';
import { UserModel } from '../models/userModel';
import { MainController } from './mainController';

export class UserController extends MainController {
    private userModel: UserModel;
    private resource: string;

    constructor(masterDBController: ControllerDBMaster,
        controllerConnections: ControllerDBClientsConnections,
        controllerPromiseConnections: ControllerDBClientsPromiseConnections,
        acl: NewACL) {
        super(masterDBController, controllerConnections, controllerPromiseConnections, acl);
        this.userModel = new UserModel(controllerConnections);
        this.resource = "users";
    }

    public getAll = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {

            let roleId = req.query.role;
            if (roleId) {
                this.getUsersWithCallback(req, res, (userResult: ResultWithData<User[]>) => {
                    if (userResult.result == ResultCode.OK && !!userResult.data) {
                        userResult.data = userResult.data.filter(u => u.rol_id == roleId);
                        res.send(userResult);
                    } else {
                        res.send(userResult);
                    }
                });
            } else {
                this.userModel.users(dbName, function (result: any) {
                    res.send(result);
                });
            }
        });
    }

    public getLastSessionActivity = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con: any) => {
                this.userModel.getLastSessionActivity(con, (r: any) => {
                    res.send(r);
                });
            });
        });
    }

    public getUserByIdMaster = (
        idMaster: number, tokenId: string, userName: string,
        rolId: number, accountId: number, dbName: string,
        req: express.Request, res: express.Response): void => {

        this.userModel.userByIdMaster(idMaster, tokenId, userName, rolId, accountId, dbName, (result: any) => {
            res.send(result);
        });
    }

    public getSessionsByDate = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.userModel.getSessionsByUserByDate(req.body.userId, req.body.dateFrom, req.body.dateTo, con, (resultSessions: any) => {
                    res.send(resultSessions);
                });
            });
        });
    }

    public getSessionsByCurrentUserByDate = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (responseUser: any) => {
                    if (responseUser.result > 0) {
                        let userId: number = responseUser.data[0].id;
                        this.userModel.getSessionsByUserByDate(userId, req.body.dateFrom, req.body.dateTo, con, (resultSessions: any) => {
                            res.send(resultSessions);
                        });
                    } else {
                        res.send({
                            result: ResultCode.Error,
                            message: "Error al recuperar el usuario."
                        });
                    }
                });
            });
        })
    }

    public getUserByUserName = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (result: any) => {
                    res.send(result);
                });
            });
        });
    }

    public getRols = (req: express.Request, res: express.Response): void => {
        const QUERY = "SELECT id , name FROM rols";
        this.masterDBController.getMasterConnection().getConnection().query(QUERY, (err: any, rols: any) => {
            if (err) {
                res.send({
                    result: ResultCode.Error,
                    message: 'Error',
                    data: err
                });
            } else {
                res.send({
                    result: ResultCode.OK,
                    message: '',
                    data: rols
                })
            }
        });
    }

    public validatePasswordCurrentUser = (req: express.Request, res: express.Response): void => {
        const QUERY = "SELECT * FROM users WHERE user_name = ?";
        this.masterDBController.getMasterConnection().getConnection().query(QUERY, [req.headers['user']], (err: any, userData: any) => {
            if (err) {
                res.send({
                    result: ResultCode.Error,
                    message: 'Error',
                    data: err
                });
            } else {
                let validOK = false;
                if (userData && userData.length > 0) {
                    let pswSHA1: string = "";
                    if (req.body.password) {
                        pswSHA1 = sha1(req.body.password.trim());
                    }
                    validOK = userData[0].password === pswSHA1;
                }
                res.send({
                    result: ResultCode.OK,
                    message: '',
                    data: validOK
                })
            }
        });
    }

    public getCurrentUser = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            this.getPool(dbName, (con) => {
                this.userModel.getUserByUsername(<string>req.headers['user'], con, (result: any) => {
                    if (result.data && result.data.length > 0) {
                        res.send({
                            result: ResultCode.OK,
                            message: "OK",
                            data: result.data[0]
                        });
                    } else {
                        res.send({
                            result: ResultCode.Error,
                            message: "Usuario existe pero no se encontro"
                        });
                    }
                });
            });
        });
    }

    public getRolCurrentUser = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            const QUERY = "SELECT rol_id FROM users WHERE user_name = ?";
            let values = [req.headers['user']];
            this.masterDBController.getMasterConnection().getConnection().query(QUERY, values, (err: any, rols: any) => {
                if (err) {
                    res.send({
                        result: ResultCode.Error,
                        message: 'Error',
                        data: err
                    });
                } else {
                    res.send({
                        result: ResultCode.OK,
                        message: '',
                        data: rols
                    })
                }
            });
        });
    }

    public isAgent = (req: express.Request, res: express.Response): void => {
        let con = this.masterDBController.getMasterConnection().getConnection();
        this.userModel.rolByUserName(req.params.username, con, (result: ResultWithData<any[]>) => {
            con.release();
            if (result.result === ResultCode.OK && result.data && result.data.length > 0) {
                res.send({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result.data[0].rol_id === Role.Agent
                })
            } else {
                res.send(result);
            }
        });
    }

    public activeDeactivateUser = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource,
            (dbName: string) => {
                let query: string = "UPDATE users SET active = ? WHERE id = ?";
                let queryParameters: any[] = [req.body.active, req.body.id];
                this.masterDBController.getMasterConnection().getConnection().query(query, queryParameters,
                    function (err: any, result: any) {
                        if (err) {
                            res.send({
                                result: ResultCode.Error,
                                message: 'Error',
                                data: err
                            });
                        } else {
                            res.send({
                                result: ResultCode.OK,
                                message: 'Usuario Activado/Desactivado correctamente.',
                                data: result
                            })
                        }
                    });
            });
    }

    public cleanNumberOfAttempts = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource,
            (dbName: string) => {
                let query: string = "UPDATE users SET numberOfAttempts = 0 WHERE id = ?";
                let queryParameters: any[] = [req.body.id];
                this.masterDBController.getMasterConnection().getConnection().query(query, queryParameters,
                    function (err: any, result: any) {
                        if (err) {
                            res.send({ result: ResultCode.Error, message: 'Error', data: err });
                        } else {
                            res.send({ result: ResultCode.OK, message: 'Usuario desbloqueado correctamente.', data: result })
                        }
                    });
            });
    }

    /**
     * Actualiza los datos de un usuario
     */
    public update = (req: express.Request, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            let user: User = req.body.user;

            // basic query
            let query = 'UPDATE users SET rol_id = ?, user_name = ? ,active = ? WHERE id = ?';
            let queryParameters: any[] = [user.rol_id, user.user_name, user.active, user.id_user_master];

            // si el usuario quiere cambiar la password armo la query de nuevo
            // TODO: refactorizar esto para no estar re-escribiendo la query y los parametros dos veces
            if (user.password && user.password !== "") {
                query = "UPDATE users SET rol_id = ?, user_name = ? , password = ? ,active = ? , requireNewPassword = 1 WHERE id = ?";

                let pswSHA1: string = sha1(user.password.trim());
                queryParameters = [user.rol_id, user.user_name, pswSHA1, user.active, user.id_user_master]
            }

            var masterConnection = this.masterDBController.getMasterConnection().getConnection();
            masterConnection.query(query, queryParameters, (err: any, result: any) => {
                if (err) {
                    console.error(new Date(), err);
                    res.send({
                        result: ResultCode.Error,
                        message: 'Error',
                        data: err
                    });
                } else {
                    this.userModel.update(user, dbName, (result: any) => {
                        res.send(result);
                    });
                }
            });
        });
    }

    /**
     * Actualiza la imagen del usuario 
     */
    public updateImage = (req: any, res: express.Response): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            let form = new formidable.IncomingForm()

            /**
             * Options
             */
            form = Object.assign(form, {
                multiples: true,
                keepExtensions: true,
                uploadDir: path.join(__dirname, '../uploads/'), // Set standard upload dir
                encoding: 'utf-8',
                type: 'multipart', // or urlencoded
                maxFieldsSize: 20 * 1024 * 1024, // default = 20 * 1024 * 1024 = 20mb
                maxFields: 1000, // Max files & fields - default = 1000
                hash: false, // sha1, md5 or false
                // @note - Disable field & file event listeners and let you handle upload yourself
                onPart(part: any) {
                    part.addListener('data', (packet: any) => {
                        // console.log('Packet received', packet.toString()) // Raw packet data
                        // packet_a + packet_b + packet_c + ... = file data
                    })
                    // Handle part / file only if .mov is not included in filename
                    if (part.filename && part.filename.indexOf('.mov') === -1) {
                        form.handlePart(part)
                        // Or if filename is not set
                    } else if (!part.filename) {
                        form.handlePart(part)
                    }
                }
            })

            /**
             * Events
             */
            form.on('fileBegin', (name: any, file: any) => {
                // file.name - basename with extension
                // file.size - currently uploaded bytes
                // file.path - beeing written to
                // file.type - mime
                // file.lastModifiedDate - date object or null
                // file.hash - hex digest if set
                // Changing file upload path can also be done here:

                let fileExtension = file.name.substring(file.name.lastIndexOf('.'));
                let user = req.headers['user'];
                let fileName = user + fileExtension;

                file.path = path.join(__dirname, '..', '..', 'public', 'images', fileName);

                this.userModel.updateImageName(user, fileName, dbName, () => {
                    // TODO: what to do if error ?
                });
            })
            form.on('progress', (bytesReceived: any, bytesExpected: any) => {
                console.log('Progress', bytesReceived, bytesExpected)
            })
            form.on('error', (err: any) => {
                console.error(new Date(), err)
            })
            form.on('aborted', () => {
                console.error(new Date(), new Error('Aborted'))
            })
            form.on('end', () => {
                console.log('End')
            })
            form.on('field', (name: any, value: any) => {
                console.log('Field', name, value)
            })
            form.on('file', (name: any, file: any) => {
                console.log('File', name, file.type)
            })

            /**
             * Function
             *
             * Passes request from express to formidable for handling.
             * Second arg is a callback executed on complete & returns all data
             *
             */
            form.parse(req, (err: any, fields: any, files: any) => {
                if (err) {
                    return res.status(500).json({ error: err })
                } else {
                    return res.status(200).json({ uploaded: true })
                }
            })
        });
    }

    public add = (req: express.Request, res: express.Response): void => {
        var mainThis = this;
        this.verifyAccess(req, res, this.resource,
            (dbName: string) => {
                let query: string = "INSERT INTO users(rol_id,user_name,password,active,requireNewPassword) VALUES (?,?,?,0,1)";
                let user: User = req.body.user;
                var masterConnection = this.masterDBController.getMasterConnection().getConnection();
                let pswSHA1: string = sha1(user.password.trim());

                masterConnection.getConnection(function (err: any, conMaster: any) {
                    if (!!err) {
                        res.send({ result: ResultCode.Error, message: "Error al crear la conexion" });
                    } else {
                        conMaster.beginTransaction(function (err: any) {
                            if (err) {
                                conMaster.rollback(function () {
                                    console.error(new Date(), err);
                                    res.send({ result: ResultCode.Error, message: 'Error al crear el usuario.', data: err });
                                });
                            } else {
                                conMaster.query(query, [user.rol_id, user.user_name, pswSHA1],
                                    function (err: any, result: any) {
                                        if (err) {
                                            conMaster.rollback(function () {
                                                console.error(new Date(), err);
                                                res.send({ result: ResultCode.Error, message: 'Error al crear el usuario.', data: err });
                                            });
                                        } else {
                                            user.id_user_master = result.insertId;
                                            let queryInsertUserAccount = "INSERT INTO users_accounts(user_id,account_id) VALUES(?,?)";
                                            conMaster.query(queryInsertUserAccount, [user.id_user_master, req.headers['accountid']],
                                                function (err: any, result: any) {
                                                    if (err) {
                                                        conMaster.rollback(function () {
                                                            console.error(new Date(), err);
                                                            res.send({ result: ResultCode.Error, message: 'Error al crear el usuario.', data: err });
                                                        });
                                                    } else {
                                                        mainThis.userModel.add(user, dbName, function (result: any) {
                                                            conMaster.commit(function (err: any) {
                                                                if (err) {
                                                                    res.send({ result: ResultCode.Error, message: "Error al enviar la transaccion" });
                                                                }
                                                                mainThis.acl.addUserNameRoles(user.user_name, user.rol_id);
                                                                conMaster.release();
                                                                res.send(result);
                                                            });
                                                        });
                                                    }
                                                });
                                        }
                                    });
                            }
                        });
                    }
                });
            }
        );
    }

    public getUsers = (req: express.Request, res: express.Response): void => {
        this.getUsersWithCallback(req, res, (userResult: ResultWithData<User[]>) => {
            res.send(userResult);
        });
    }

    public getUsersWithCallback = (req: express.Request, res: express.Response, callback: (userResult: ResultWithData<User[]>) => void): void => {
        this.verifyAccess(req, res, this.resource, (dbName: string) => {
            let query: string = `SELECT u.id as id_user_master, rol_id, user_name, active, numberOfAttempts
                                FROM users u
                                INNER JOIN users_accounts ON user_id = u.id
                                WHERE account_id = ?
                                ORDER BY user_name ASC`;
            let accountId = req.headers['accountid'];
            this.masterDBController.getMasterConnection().getConnection().query(query, [accountId], (err: any, usersMaster: User[]) => {
                if (!!err) {
                    callback({
                        result: ResultCode.Error,
                        message: 'Error',
                        data: err
                    });
                } else {

                    if (usersMaster.length > 0) {
                        this.userModel.usersByUsersMaster(usersMaster, dbName, (result: any) => {
                            callback(result);
                        });
                    } else {
                        callback({
                            result: ResultCode.OK,
                            message: '',
                            data: usersMaster
                        })
                    }
                }
            });
        }
        );
    }
}
