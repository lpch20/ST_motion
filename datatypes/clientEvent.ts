
export interface ICustomerEvent {
    id: number;
    idCustomer: number;
    idAction: number;
    idPayment: string;
    date: Date;
    dateReminder: Date;
    phone: string;
    ext: string;
    idUser: number;
    annotation: string;
    eventType: number;
}

export class ClientEvent {
    id: number;
    idCustomer: number;
    idAction: number;
    idPayment: string;
    date: Date;
    dateReminder: Date;
    phone: string;
    ext: string;
    idUser: number;
    message: string;
    eventType: number;

    constructor(customerEvent?: ICustomerEvent) {
        this.id = customerEvent && customerEvent.id || 0;
        this.idCustomer = customerEvent && customerEvent.idCustomer || 0;
        this.idAction = customerEvent && customerEvent.idAction || 0;
        this.idPayment = customerEvent && customerEvent.idPayment || '';
        this.date = customerEvent && customerEvent.date || new Date();
        this.dateReminder = customerEvent && customerEvent.dateReminder || new Date();
        this.phone = customerEvent && customerEvent.phone || "";
        this.ext = customerEvent && customerEvent.ext || "";
        this.idUser = customerEvent && customerEvent.idUser || 0;
        this.message = customerEvent && customerEvent.annotation || "";
        this.eventType = customerEvent && customerEvent.eventType || 0;
    }
}