
import * as _ from 'lodash';
import { FilterProgress } from '../../../datatypes/filter/filter-progress';
import { FilterStep } from '../../../datatypes/filter/filter-step';
import { Filters } from '../../../datatypes/filter/filters';
import { ResultCode, ResultWithData } from '../../../datatypes/result';
import { ControllerDBClientsConnections } from '../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';
import { MainModel } from './mainModel';

export class FiltersModel extends MainModel {

    constructor(private dbName: string, private controllerConnections: ControllerDBClientsConnections) {
        super();
    }

    insertFiltersDef(con: any, group: number, filter: FilterStep, order: number, usersIds: number[], callback: any): any {
        const INSERT_FILTER_DEF: string = ' INSERT INTO  filter_def (`group`, `name`, `values`, `order`) VALUES (?, ?, ?, ?) ';
        con.query(INSERT_FILTER_DEF, [group, filter.name, filter.values.join(','), order],
            super.errorHandlerGeneric<number>(con, callback, (u_) => {
                callback(null, { result: ResultCode.OK, message: 'OK' });
            })
        );
    }

    getFiltersDef(callback: (r: ResultWithData<Filters[]>) => void): void {
        var pool = this.controllerConnections.getUserConnection(this.dbName);
        pool.getConnection((err: any, con: any) => {
            if (!!err) {
                this.errorModel(con, err, callback);
            } else {
                const F_USERS_QUERY: string = 'SELECT * FROM filter_users';
                con.query(F_USERS_QUERY, super.errorHandlerGeneric<{ group: number, idUser: number }[]>(con, callback, (filterUsers) => {
                    const FILTER_DEF = `SELECT filter_def.group, filter_def.name, filter_def.values, filter_def.order
                            FROM filter_def
                            GROUP BY filter_def.group, filter_def.name`;
                    con.query(FILTER_DEF, super.errorHandlerGeneric<{ group: number, name: string, values: any[], order: number }[]>(con, callback, (filterProgress) => {

                        var result: Filters[] =
                            _.chain(filterProgress)
                                .groupBy(g => g.group)
                                .map((users, group) => {
                                    var filterGroupName = _.chain(users).groupBy(g => g.name).map((values, filterName) => {
                                        return {
                                            name: filterName,
                                            values: values[0].values,
                                            order: values[0].order,
                                            group: parseInt(group)
                                        };
                                    }).value();
                                    return {
                                        group: filterGroupName[0].group,
                                        filters: filterGroupName,
                                        userIds: filterUsers.filter(f => f.group.toString() == group).map(u => u.idUser)
                                    };
                                })
                                .value();

                        con.release();
                        callback({
                            result: ResultCode.OK,
                            message: 'OK',
                            data: result
                        });
                    }));
                }));
            }
        });
    }

    getFilterProgress(groupId: number, callback: (r: ResultWithData<FilterProgress[]>) => void): void {
        var pool = this.controllerConnections.getUserConnection(this.dbName);
        pool.getConnection((err: any, con: any) => {
            if (!!err) {
                this.errorModel(con, err, callback);
            } else {
                const FILTER_PROGRESS = `SELECT filter_def.group, filter_def.order, filter_def.name, filter_def.values, SUM(IF(item_queue.status='called' or item_queue.status='skipped',1,0))*100/count(*) AS percentage
                FROM item_queue 
                INNER JOIN queue_user ON item_queue.idQueue = queue_user.idQueue
                INNER JOIN filter_users ON queue_user.idUser = filter_users.idUser 
                INNER JOIN filter_def ON filter_users.group = filter_def.group AND item_queue.itemOrder = filter_def.order
                WHERE filter_def.group = ?
                GROUP BY filter_def.name`;

                con.query(FILTER_PROGRESS, [groupId], super.errorHandlerGeneric<FilterProgress[]>(con, callback, (filterProgress) => {
                    con.release();
                    callback({
                        result: ResultCode.OK,
                        message: 'OK',
                        data: filterProgress
                    });
                }));
            }
        });
    }

    getCountByUsers(users: number[], callBack: (r: ResultWithData<number>) => void): void {
        var pool = this.controllerConnections.getUserConnection(this.dbName);
        pool.getConnection((err: any, con: any) => {
            if (!!err) {
                this.errorModel(con, err, callBack);
            } else {
                const QUERY: string = 'SELECT COUNT(*) as count FROM customer ' +
                    ' INNER JOIN item_queue ON item_queue.idCustomer = customer.id ' +
                    ' INNER JOIN queue_user ON queue_user.idQueue = item_queue.idQueue ' +
                    ' WHERE queue_user.idUser IN ( ' + users.join(',') + ' ) ';

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

    filter(query: string, callBack: (r: ResultWithData<number>) => void): void {
        var pool = this.controllerConnections.getUserConnection(this.dbName);
        pool.getConnection((err: any, con: any) => {
            if (!!err) {
                this.errorModel(con, err, callBack);
            } else {
                con.query(query, (err: any, result: { count: number }[]) => {
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

    filterIds(con: any, query: string, callBack: (r: ResultWithData<number[]>) => void): void {
        con.query(query, (err: any, result: { id: number }[]) => {
            if (!!err) {
                this.errorModel(con, err, callBack);
            } else {
                callBack({
                    result: ResultCode.OK,
                    message: 'OK',
                    data: result.map(r => r.id)
                });
            }
        });
    }

    public initQueueOrder(con: any, usersIds: number[], reiniciar: boolean, callback: (err: any, result: { count: number }[]) => void) {
        const INIT_QUERY: string = ` UPDATE item_queue 
             INNER JOIN queue_user ON item_queue.idQueue = queue_user.idQueue 
             SET itemOrder = 999 ${reiniciar ? ", status = 'withoutCalling', item_queue.idUser = NULL " : ''}
             WHERE queue_user.idUser IN ( ? ) `;

        con.query(INIT_QUERY, [usersIds], (err: any, result: { count: number }[]) => {
            callback(err, result)
        });
    }

    beginTransaction(trans: (con: any) => any) {
        var pool = this.controllerConnections.getUserConnection(this.dbName);
        pool.getConnection((err: any, con: any) => {
            if (!!err) {
                // TODO: remplazar a por callback de error
                var a: any;
                this.errorModel(con, err, a);
            } else {
                con.beginTransaction((err: any) => {
                    trans(con);
                });
            }
        });
    }
}
