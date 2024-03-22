import { Role } from '../../../datatypes/enums';
import { Result, ResultCode, ResultWithData } from '../../../datatypes/result';
import { User } from '../../../datatypes/user';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { IQueryableConnection } from '../controllers/mainController';
import { MainModel } from './mainModel';

export class UserModel extends MainModel {
    constructor(private controllerConnections: ControllerDBClientsConnections) {
        super();
    }
    //
    // TODO: tipar  ResultWithData<any[]>
    //
    getLastSessionActivity(con: any, callBack: (r: ResultWithData<any[]>) => void): void {
        const QUERY: string = ` SELECT t.date, t.userId, t.login
                                FROM user_session t
                                INNER JOIN
                                    (
                                        SELECT userId, max(date) as date
                                        FROM user_session group by userId
                                    ) tm on t.userId = tm.userId and t.date = tm.date`;
        con.query(QUERY, (err: any, result: any[]) => {
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

    //
    // TODO: tipar  ResultWithData<any[]>
    //
    queueByUser(idUser: number, con: any, callBack: (r: ResultWithData<any>) => void): void {
        const QUERY: string = 'SELECT idQueue FROM queue_user WHERE idUser = ?';
        con.query(QUERY, [idUser], (err: any, result: any[]) => {
            if (!!err) {
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

    //
    // TODO: tipar  ResultWithData<any[]>
    //
    add(user: User, dbName: string, callBack: (r: ResultWithData<any[]>) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection((err: any, con: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                const QUERY = 'INSERT INTO users(ext,user_name,firstname,lastname,id_user_master) VALUES(?,?,?,?,?)';
                con.query(QUERY, [user.ext, user.user_name, user.firstname, user.lastname, user.id_user_master],
                    (err: any, result: any) => {
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

    //
    // TODO: tipar  ResultWithData<any[]>
    //
    update(user: User, dbName: string, callBack: (r: ResultWithData<any[]>) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection((err: any, con: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                const QUERY = 'UPDATE users SET ext = ?, user_name = ?, firstname = ? ,lastname = ?, withoutPhone = ? WHERE id_user_master = ? ';
                con.query(QUERY, [user.ext, user.user_name, user.firstname, user.lastname, user.withoutPhone, user.id_user_master], (err: any, result: any) => {
                    if (err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        con.release();
                        let resultMessage = "";
                        if (result.affectedRows === 1) {
                            resultMessage = "Los datos se actualizaron correctamente";
                        }

                        callBack({
                            result: ResultCode.OK,
                            message: resultMessage,
                            data: result
                        });
                    }
                });
            }
        });
    }

    //
    // TODO: tipar  ResultWithData<any[]>
    //
    updateImageName(username: string, imageName: string, dbName: string, callBack: (r: Result) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection((err: any, con: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                const QUERY = 'UPDATE users SET image_name = ? WHERE user_name = ? ';
                con.query(QUERY, [imageName, username], (err: any, result: any) => {
                    if (err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        con.release();
                        callBack({
                            result: ResultCode.OK,
                            message: "OK"
                        });
                    }
                });
            }
        });
    }

    //
    // TODO: tipar  ResultWithData<any[]>
    //
    users(dbName: string, callBack: (r: ResultWithData<User[]>) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection((err: any, con: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                const QUERY = 'SELECT * FROM users ORDER BY lastname, firstname';
                con.query(QUERY, (err: any, result: any) => {
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
    };

    //
    // TODO: tipar  ResultWithData<any[]>
    //
    usersByRole(role: Role, dbName: string, callBack: (r: ResultWithData<User[]>) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection((err: any, con: any) => {
            if (!!err) {
                this.errorModel(con, err, callBack);
            } else {
                const QUERY = 'SELECT * FROM users ORDER BY lastname, firstname';
                con.query(QUERY, (err: any, result: any) => {
                    if (err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        con.release();
                        callBack({
                            result: 1,
                            message: "OK",
                            data: result
                        });
                    }
                });
            }
        });
    };

    //
    // TODO: tipar  ResultWithData<any[]>
    //
    getUserByUsername(username: string, con: IQueryableConnection, callBack: (r: ResultWithData<any[]>) => void): void {
        const QUERY = 'SELECT id,user_name,firstname,lastname, image_name, withoutPhone FROM users WHERE user_name = ?';
        con.query(QUERY, [username], (err: any, result: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: "OK",
                    data: result
                });
            }
        });
    };

    //
    // TODO: tipar  ResultWithData<any[]>
    //
    rolByUserName(username: string, con: any, callBack: (r: ResultWithData<any[]>) => void): void {
        const QUERY = 'SELECT rol_id FROM users WHERE user_name = ?';
        con.query(QUERY, [username], (err: any, result: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: "OK",
                    data: result
                });
            }
        });
    }

    //
    // TODO: tipar  ResultWithData<any[]>
    //
    /**
     * 
     * @param userId 
     * @param login 
     * @param agent 
     * @param ip 
     * @param con 
     * @param callBack 
     */
    addUserSessionEntry(userId: number, login: boolean, agent: number, ip: string, con: any, callBack: (r: ResultWithData<any[]>) => void): void {
        this.addUserSessionEntryWithDate(new Date(), userId, login, agent, ip, con, callBack);
    }

    /**
     * 
     * @param date 
     * @param userId 
     * @param login 
     * @param agent 
     * @param ip 
     * @param con 
     * @param callBack 
     */
    addUserSessionEntryWithDate(date: Date, userId: number, login: boolean, agent: number, ip: string, con: any, callBack: (r: ResultWithData<any[]>) => void): void {
        const QUERY = 'INSERT INTO user_session (date,userId,login,agent, ip) VALUES (?,?,?,?, ?)';
        con.query(QUERY, [date, userId, login, agent, ip], (err: any, result: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: "OK",
                    data: result
                });
            }
        });
    }

    //
    // TODO: tipar  any
    //
    userByIdMaster(idMaster: number, tokenId: string, userName: string, rolId: number, accountId: number, dbName: string, callBack: (r: any) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection((err: any, con: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                const QUERY = 'SELECT * FROM users WHERE id_user_master = ?';
                con.query(QUERY, [idMaster], (err: any, userResult: any) => {
                    if (err) {
                        this.errorModel(con, err, callBack);
                    } else {
                        con.release();
                        if (userResult.length > 0) {
                            callBack({
                                result: ResultCode.OK,
                                message: "OK",
                                data: {
                                    id: userResult[0].id,
                                    tokenId,
                                    user: userName,
                                    rolId,
                                    accountId,
                                    withoutPhone: userResult[0].withoutPhone
                                }
                            });
                        } else {
                            callBack({
                                result: ResultCode.Error,
                                message: "No existe el usuario"
                            });
                        }
                    }
                });
            }
        });
    }

    //
    // TODO: tipar  any
    //
    usersByUsersMaster(usersMaster: User[], dbName: string, callBack: (r: any) => void): void {
        var pool = this.controllerConnections.getUserConnection(dbName);
        pool.getConnection((err: any, con: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                this.getUsersByUserMaster(0, usersMaster, dbName, con, callBack);
            }
        });
    }

    //
    // TODO: tipar  any
    //
    private getUsersByUserMaster(indexUser: number, users: User[], dbName: string, con: any, callBack: (r: any) => void): void {
        if (indexUser < users.length) {
            const QUERY = 'SELECT id, firstname ,lastname, ext, withoutPhone FROM users WHERE id_user_master = ?';
            con.query(QUERY, [users[indexUser].id_user_master], (err: any, userResult: User[]) => {
                if (err) {
                    this.errorModel(con, err, callBack);
                } else {
                    if (userResult.length > 0) {
                        users[indexUser].id = userResult[0].id;
                        users[indexUser].firstname = userResult[0].firstname;
                        users[indexUser].lastname = userResult[0].lastname;
                        users[indexUser].ext = userResult[0].ext;
                        users[indexUser].withoutPhone = userResult[0].withoutPhone;
                    }
                    indexUser++;
                    this.getUsersByUserMaster(indexUser, users, dbName, con, callBack);
                }
            });
        } else {
            con.release();
            callBack({
                result: ResultCode.OK,
                message: "OK",
                data: users
            });
        }
    }

    //
    // TODO: tipar  any
    //
    public getSessionsByUserByDate(idUser: number, dateFrom: Date, dateTo: Date, con: any, callBack: (r: any) => void): void {
        let params: any[] = [dateFrom, dateTo];
        let QUERY: string = 'SELECT * FROM user_session WHERE date BETWEEN ? AND ? ';
        if (idUser && idUser !== 0) {
            QUERY += ' AND userId = ?';
            params.push(idUser);
        }
        QUERY += ' ORDER BY date ASC';

        con.query(QUERY, params, (err: any, result: any) => {
            if (err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: "OK",
                    data: result
                });
            }
        });
    };
}
