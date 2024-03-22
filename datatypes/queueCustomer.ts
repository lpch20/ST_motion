import { Customer } from "./Customer";
import { CustomersService } from "../client/src/app/requiro/services/customers.service";
import { EventTypeService } from "../client/src/app/requiro/services/event-type.service";
import { CampaignService } from "app/requiro/services/campaign.service";

export class QueueCustomer {    
    indexCurrentCustomer:number;
    indexCurrentPhone:number;
    private customers:Customer[]

    constructor(customers:Customer[]) {      
        console.log("cola");  
        this.indexCurrentCustomer = 0;
        this.indexCurrentPhone = 0;
        this.customers = customers;
    }

    addCustomer(customer:Customer):void{
        this.customers.push(customer);
    }

    getCurrent():Customer{
        return this.customers[this.indexCurrentCustomer];
    }

    getNext():Customer{
        this.indexCurrentCustomer++;
        this.indexCurrentPhone = 0;
        return this.getCurrent();
    }

    getNextPhone():string{
        let customer:Customer;
        customer =  this.getCurrent();
        this.indexCurrentPhone++;
        return customer.getPhones()[this.indexCurrentPhone];
    }
}