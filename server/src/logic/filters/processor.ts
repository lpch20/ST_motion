import { FilterStep } from '../../../../datatypes/filter/filter-step';
import { FiltersModel } from '../../models/filtersModel';
import { ResultWithData, ResultCode } from '../../../../datatypes/result';
import { FilterResult } from '../../../../datatypes/filter/filterResult';
import { IFilterProcessor } from './base-filter-processor';
import { CampaignFilterProcessor } from './complex-filters/campaign-filter-processor';
import { CustomerAgeFilterProcessor } from './basic-filters/customer-age-filter-processor';
import { CustomerAssignDateFilterProcessor } from './basic-filters/customer-assign-date-filter-processor';
import { CustomerInteractionsFilterProcessor } from './complex-filters/customer-interactions-filter-processor';
import { CustomerDebtFilterProcessor } from './basic-filters/customer-debt-filter-processor';
import { CustomerDaysArrearsFilterProcessor } from './basic-filters/customer-days-arrears-filter-processor';
import { CustomerStateFilterProcessor } from './basic-filters/customer-state-filter-processor';
import _ from 'lodash';
import { parallel } from 'async';
import { ControllerDBClientsConnections } from '../../../motionLibJS/serverSide/masterClientDBFramework/controllers/controllerDBClient';

export class Processor {

    constructor(private dbName: string, private controllerConnections: ControllerDBClientsConnections) { }

    public filter(step: FilterStep, previousSteps: FilterStep[], users: number[], callback: (s: ResultWithData<FilterResult>) => any): void {

        let { filters, joins } = this.convertStepsToFilters(step, previousSteps);

        const ONLY_COUNT = true;
        let query = this.createQuery(filters, joins, users, ONLY_COUNT);

        let filtersModel = new FiltersModel(this.dbName, this.controllerConnections);
        filtersModel.filter(query, (r: ResultWithData<number>) => {
            let result: ResultWithData<FilterResult> = {
                result: ResultCode.OK,
                message: 'OK',
                data: {
                    count: <number>r.data,
                    timestamp: new Date().getTime()
                }
            };
            callback(result);
        });
    }

    public apply(filters: FilterStep[], usersIds: number[], reiniciar: boolean, callback: (r: ResultWithData<number>) => void): void {

        let filtersModel = new FiltersModel(this.dbName, this.controllerConnections);
        filtersModel.beginTransaction((con: any) => {
            // iniialize queue
            filtersModel.initQueueOrder(con, usersIds, reiniciar, filtersModel.errorHandlerGeneric<number>(con, callback, (u_) => {
                let time = new Date().getTime();
                let group = Math.round(time / Math.pow(8, 10)) * Math.pow(8, 10) - time;

                var querysFn = _.map(filters, (f_: FilterStep, index: number, filters: FilterStep[]): ((c: any) => void) => {
                    return (parallelCallback) => {
                        // save filter def
                        filtersModel.insertFiltersDef(con, group, filters[index], index, usersIds,
                            filtersModel.errorHandlerGeneric<number[]>(con, callback, (c_) => {
                                this.getFiltrableCustomerIds(con, filtersModel, filters, index, usersIds,
                                    filtersModel.errorHandlerGeneric<number[]>(con, callback, (customerIds: number[]) => {
                                        if (customerIds && customerIds.length > 0) {
                                            this.applyFilterOrder(con, index, customerIds,
                                                filtersModel.errorHandlerGeneric(con, callback, (u_) => {
                                                    parallelCallback(null, { result: ResultCode.OK, message: 'OK' });
                                                })
                                            );
                                        }
                                        else {
                                            parallelCallback(null, {
                                                result: ResultCode.OK,
                                                message: 'OK. No se aplicaron filtros al agente debido a que no tenia ningun cliente que cumpliera los filtros'
                                            });
                                        }
                                    })
                                );
                            })
                        );
                    };
                });

                parallel(querysFn, (err: any, success: any) => {
                    // delete user using filter 
                    const DELETE_USER_FILTER_DEF: string = ' DELETE FROM filter_users WHERE idUser IN (?)';
                    con.query(DELETE_USER_FILTER_DEF, [usersIds], filtersModel.errorHandlerGeneric<number>(con, callback, (u_) => {

                        const INSERT_USER_FILTER_DEF: string = ' INSERT INTO filter_users(`idUser`, `group`) VALUES ? ';
                        con.query(INSERT_USER_FILTER_DEF, [usersIds.map(idUser => [idUser, group])],
                            filtersModel.errorHandlerGeneric<number>(con, callback, (u_) => {

                                const DELETE_UNUSER_FILTER_DEF: string = ' DELETE FROM filter_def WHERE filter_def.group NOT IN (SELECT filter_users.`group` FROM filter_users) ';
                                con.query(DELETE_UNUSER_FILTER_DEF, filtersModel.errorHandlerGeneric<number>(con, callback, (u_) => {
                                    con.commit(function (err: any) {
                                        if (!!err) {
                                            con.rollback(function () {
                                                console.log(err);
                                                con.release();
                                                callback({ result: ResultCode.Error, message: "Error interno." });
                                            });
                                        } else {
                                            con.release();
                                            callback({ result: ResultCode.OK, message: "OK" });
                                        }
                                    });
                                }));
                            })
                        );
                    }));
                });
            }));
        });
    }

    private getFiltrableCustomerIds(con: any, filtersModel: FiltersModel, steps: FilterStep[], currIndex: number, users: number[], callback: (err: any, ids: number[]) => void) {
        let step = steps[currIndex];
        let previousSteps = _.take(steps, currIndex);

        let { filters, joins } = this.convertStepsToFilters(step, previousSteps);

        const ONLY_COUNT = false;
        let query = this.createQuery(filters, joins, users, ONLY_COUNT);

        filtersModel.filterIds(con, query, (r: ResultWithData<number[]>) => {
            callback(null, <number[]>r.data);
        });
    }

    private convertStepsToFilters(step: FilterStep, previousSteps: FilterStep[]) {
        const stepFilter = Processor.createFilterProcessor(step.name).createFilterCondition(step.values);
        const previousStepsFilter = _.map(previousSteps, s => Processor.createFilterProcessor(s.name)
                                   .createNegatedFilterCondition(s.values));
        const filters = previousStepsFilter.concat(stepFilter);
        const joins = _.uniq(previousSteps.concat(step)
                                          .map(s => Processor.createFilterProcessor(s.name).getJoin())
                                          .filter(s => s && s.length > 0));
        return { filters, joins };
    }

    private createQuery(conditions: string[], joins: string[], users: number[], onlyCount: boolean): string {
        let sqlFilter = _.join(conditions, ' AND ');
        let sqlJoin = joins.length > 0 ? joins.map(j => ' INNER JOIN ' + j).join(' ') : "";

        let query: string = `SELECT ${onlyCount ? ' COUNT(*) as count ' : ' customer.id '} FROM customer 
             INNER JOIN item_queue ON item_queue.idCustomer = customer.id 
             INNER JOIN queue_user ON queue_user.idQueue = item_queue.idQueue 
             ${sqlJoin && sqlJoin.length > 0 ? sqlJoin : ' '}
             WHERE queue_user.idUser IN ( ${users.join(',')} ) 
             ${sqlFilter && sqlFilter.length > 0 ? ' AND ' + sqlFilter : ''}`;

        return query;
    }

    applyFilterOrder(con: any, index: number, customerIds: number[], callback: (err: any, result: any) => void): any {
        const UPDATE_QUERY: string = ' UPDATE item_queue SET itemOrder = ' + index +
            ' WHERE idCustomer IN ( ' + customerIds.join(',') + ' ) ';
        con.query(UPDATE_QUERY, (err: any, result: { count: number; }[]) => {
            if (!!err) {
                callback({ result: -1, message: "Error del sistema al aplicar filtros." }, null);
            }
            else {
                callback(null, {
                    result: ResultCode.OK,
                    message: 'OK'
                });
            }
        });
    }

    static createFilterProcessor(name: string): IFilterProcessor {
        let filterProcessor: IFilterProcessor;
        switch (name) {
            case 'por-campania':
                filterProcessor = new CampaignFilterProcessor();
                break;
            case 'rango-edad':
                filterProcessor = new CustomerAgeFilterProcessor();
                break;
            case 'fecha-asignacion':
                filterProcessor = new CustomerAssignDateFilterProcessor();
                break;
            case 'por-departamento':
                filterProcessor = new CustomerStateFilterProcessor();
                break;
            case 'monto-deuda':
                filterProcessor = new CustomerDebtFilterProcessor();
                break;
            case 'dias-atraso':
                filterProcessor = new CustomerDaysArrearsFilterProcessor();
                break;
            case 'gestiones':
                filterProcessor = new CustomerInteractionsFilterProcessor();
                break;
            default:
                throw "Valor no definido: " + name;
        }
        return filterProcessor;
    }
}