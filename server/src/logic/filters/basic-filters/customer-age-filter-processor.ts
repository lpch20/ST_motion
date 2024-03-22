import { BaseFilterProcessor } from '../base-filter-processor';
import moment from 'moment';

export class CustomerAgeFilterProcessor extends BaseFilterProcessor {
    createCondition(values: any[], negated: boolean): string {
        let minAge = values[0];
        let maxAge = values[1];

        let currYear = moment().year();
        let currDate = moment().date()
        let currMonth = moment().month();

        let from = moment([(currYear - maxAge), currMonth, currDate]).format("YYYY-MM-DD");
        let to = moment([(currYear - minAge), currMonth, currDate]).format("YYYY-MM-DD");

        let filterQuery = ` customer.date ${negated ? ' NOT ' : ''} BETWEEN '${from}' AND '${to}'`;
        return filterQuery;
    }
}
