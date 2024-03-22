import { BaseFilterProcessor } from '../base-filter-processor';

export class CustomerDebtFilterProcessor extends BaseFilterProcessor {
    createCondition(values: any[], negated: boolean): string {
        let min = values[0];
        let max = values[1];

        let filterQuery = ` customer_debt.maxToCharge ${negated ? ' NOT ' : ''} BETWEEN ${min} AND ${max} `;
        return filterQuery;
    }

    getJoin(): string {
        return BaseFilterProcessor.JOIN_CUSTOMER_DEBT;
    }
}
