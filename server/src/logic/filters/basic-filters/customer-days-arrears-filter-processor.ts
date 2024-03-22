import { BaseFilterProcessor } from '../base-filter-processor';

export class CustomerDaysArrearsFilterProcessor extends BaseFilterProcessor {
    createCondition(values: any[], negated: boolean): string {
        const min = values[0];
        const max = values[1];

        const filterQuery = ` customer_debt.delayOrder ${negated ? ' NOT ' : ''} BETWEEN ${min} AND ${max} `;
        return filterQuery;
    }

    getJoin(): string {
        return BaseFilterProcessor.JOIN_CUSTOMER_DEBT;
    }
}
