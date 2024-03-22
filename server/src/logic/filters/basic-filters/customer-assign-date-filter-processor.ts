import { BaseFilterProcessor } from '../base-filter-processor';
import moment from 'moment';

export class CustomerAssignDateFilterProcessor extends BaseFilterProcessor {
    createCondition(values: any[], negated: boolean): string {
        let minDate = values[0];
        let maxDate = values[1];

        let filterQuery = ` customer.assignDate ${negated ? ' NOT ' : ''} BETWEEN '${minDate}' AND '${maxDate}'`;
        return filterQuery;
    }
}
