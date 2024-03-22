export interface IFilterProcessor {
    createFilterCondition(values: any[]): string;
    createNegatedFilterCondition(values: any[]): string;
    getJoin(): string;
}

export abstract class BaseFilterProcessor implements IFilterProcessor {
    abstract createCondition(values: any[], negated: boolean): string;

    createFilterCondition(values: any[]): string {
        const negated = false;
        return this.createCondition(values, negated);
    }
    createNegatedFilterCondition(values: any[]): string {
        const negated = true;
        return this.createCondition(values, negated);
    }

    getJoin(): string { return ""; }

    protected static JOIN_CUSTOMER_DEBT = ' customer_debt ON customer.id = customer_debt.idCustomer ';
    protected static JOIN_CUSTOMER_CAMPAIGN = ' customer_campaign ON customer.id = customer_campaign.idCustomer ';
}