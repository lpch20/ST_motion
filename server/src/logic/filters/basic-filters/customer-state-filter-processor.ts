import { BaseFilterProcessor } from '../base-filter-processor';

export class CustomerStateFilterProcessor extends BaseFilterProcessor {
    createCondition(values: any[], negated: boolean): string {
        let filterQuery = values[0] == "Montevideo" && !negated ? "customer.idDepartment = 10" : "customer.idDepartment <> 10";
        return filterQuery;
    }
}