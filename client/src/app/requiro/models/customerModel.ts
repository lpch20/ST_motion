import { ClientEvent, ICustomerEvent } from '../../../../../datatypes/clientEvent';
import { Customer } from '../../../../../datatypes/Customer';
import { CustomersService } from '../services/customers.service';
import { EventsService } from '../services/events.service';

export class CustomerModel {

    private _customer: Customer;
    private _customers: Map<string, { timer: Date, item: Customer }>;
    eventData: { idCampaign: number, event: ClientEvent } = { idCampaign: 0, event: new ClientEvent() };

    constructor(private customerService: CustomersService, private customerEventServices: EventsService) {
        this._customers = new Map<string, { timer: Date, item: Customer }>();
    }



    set customer(customer: Customer) {
        this._customer = customer;
    }

    get customer(): Customer {
        return this._customer;
    }

    getCustomerEventByCustomerByType(idCustomer: number, eventType: number, callBack: any): void {
        this.customerEventServices.getEventByCustomer(idCustomer).subscribe(
            responseEvents => {
                if (eventType === 0) {
                    callBack(responseEvents.data);
                } else {
                    if (responseEvents.data.length > 0) {
                        const events = responseEvents.data.filter(e => e.eventType === eventType);
                        callBack(events);
                    } else {
                        callBack([]);
                    }
                }
            }
        );
    }

    setCurrentCustomer(id: number, callBack: any): void {
        /*
        if(this._customers.get(id.toString())){
            console.log("Lo trajo de cache");
            callBack({ result: ResultCode.OK });
        }else{
            */
        console.log('Lo pidio tra vez');
        this.customerService.getCustomersById(id).subscribe(
            responseCustomerById => {
                if (responseCustomerById.result > 0) {
                    const c: Customer = responseCustomerById.data;
                    let customerAux = new Customer(c.id, c.ci, c.names, c.lastnames, c.city, c.address, c.email, c.clearingTar, c.clearingOrd);
                    customerAux.idDepartment = c.idDepartment;
                    customerAux.idCity = c.idCity;
                    customerAux.idCareer = c.idCareer;
                    customerAux.age = c.age;

                    customerAux.setCampaign(c.idCampaign);
                    for (let i = 0; i < c.phones.length; i++) {
                        customerAux.addPhone(c.phones[i]);
                    }
                    customerAux.setCurrentPhone();
                    for (let i = 0; i < c.events.length; i++) {
                        let event: ICustomerEvent;
                        event = {
                            id: c.events[i].id, idCustomer: c.events[i].idCustomer, idPayment: c.events[i].idPayment,
                            date: c.events[i].date, dateReminder: c.events[i].dateReminder,
                            phone: c.events[i].phone, idAction: c.events[i].idAction,
                            ////////////////////
                            // extension del agente hardcodeado
                            ////////////////////
                            ext: '00',
                            idUser: c.events[i].idUser,
                            annotation: c.events[i].message, eventType: c.events[i].eventType
                        };
                        customerAux.addEvent(new ClientEvent(event));
                    }
                    // this.annotation(customerAux.phones[0]);
                    this._customer = customerAux;
                    this._customers.set(customerAux.id.toString(), { timer: new Date(), item: customerAux });
                    callBack({ result: responseCustomerById.result });
                } else {
                    callBack({ result: responseCustomerById.result });
                }
            }
        );
        /*
    }
    */
    }

}