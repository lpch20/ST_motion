import { BaseFilterProcessor } from "../base-filter-processor";

export class CustomerInteractionsFilterProcessor extends BaseFilterProcessor {

    createCondition(values: any[], negated: boolean): string {
        let min = values[0]; 
        let max = values[1];

        let filterQuery = `        
        (
            SELECT IFNULL(customer_interactions.count, 0)
            FROM customer innerCust
            LEFT JOIN customer_interactions ON innerCust.id = customer_interactions.idCustomer
            WHERE customer.id = innerCust.id
        ) +
        (			
            SELECT count(customer_events.idCustomer)
            FROM customer innerCust
            LEFT JOIN customer_events ON innerCust.id = customer_events.idCustomer
            WHERE customer.id = innerCust.id
            GROUP BY innerCust.id
        ) ${negated?' NOT ':''} BETWEEN ${min} AND ${max}`
        return filterQuery;
    }
}