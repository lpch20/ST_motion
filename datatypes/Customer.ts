import { ClientEvent } from "./clientEvent";

export interface ICustomer {
    id: number;
    names: string;
    lastnames: string;
    email: string;
    date: Date;
    state: string;
    city: string;
    address: string;
    idProfession: number;
    ci: number;
}

export class Customer {
    id: number;
    ci: string;
    names: string;
    lastnames: string;
    city: string;
    address: string;
    email: string;
    phones: string[];
    clearingTar: boolean;
    clearingOrd: boolean;
    events: ClientEvent[];
    idCampaign: number;
    idDepartment: number;
    idCity: number;
    idCareer: number;
    assigned: boolean;
    date: Date;
    age: number;
    currentIndexPhone: number = 0;
    currentPhone: string = "";
    lastImportId: number;

    eventData: { idCampaign: number, event: ClientEvent } = { idCampaign: 0, event: new ClientEvent() };

    constructor(id: number, ci: string, names: string, lastnames: string,
        city: string, address: string, email: string, clearingTar: boolean,
        clearingOrd: boolean) {
        this.id = id;
        this.ci = ci;
        this.names = names;
        this.lastnames = lastnames;
        this.email = email;
        this.city = city;
        this.address = address;
        this.clearingOrd = clearingOrd;
        this.clearingTar = clearingTar;
        this.events = new Array<ClientEvent>();
        this.phones = new Array<string>();
        this.idCampaign = 0;
        this.idDepartment = 0;
        this.idCity = 0;
        this.idCareer = 0;
        this.assigned = false;
        this.age = 0;
        this.date = new Date();
        this.lastImportId = 0;
    }

    public setCampaign(idCampaign: number): void {
        this.idCampaign = idCampaign;
    }

    public setCurrentPhone() {
        if (this.phones.length > 0) {
            this.currentPhone = this.phones[this.currentIndexPhone];
            console.log("current phone", this.currentPhone);
        }
    }

    public addPhone(phone: string): void {
        this.phones.push(phone);
    }

    public addEvent(event: ClientEvent): void {
        this.events.push(event);
    }

    public getPhones(): Array<string> {
        return this.phones;
    }

    public newPhone(tel: string): void {
        this.phones.push(tel);
    }

    /**
     * 
     * @param phone Telefono que se va a cambiar de posicion.
     * @param position Nueva posicion del telefono.
     * @param oldPosition Posicion antigua del telefono.
     */
    public changePositionPhone(phone: string, position: number, oldPosition: number): void {
        let currentPhoneInPosition = this.phones[position];
        this.phones[position] = phone;
        this.phones[oldPosition] = currentPhoneInPosition;
    }

    public removeTel(tel: string): void {
        let countOcurrences = this.phones.filter(phone => phone === tel).length;
        this.phones = this.phones.filter(function (val: string) {
            return val != tel;
        });
        if (countOcurrences > 1) {
            this.phones.push(tel);
        }
    }

    public addClientEvent(event: ClientEvent) {
        this.events.unshift(event);
        //this.events.push(event);
    }

    public getClientEvents(): ClientEvent[] {
        return this.events;
    }

    public getClientEventByType(eventType: number): ClientEvent[] {
        if (eventType === 0) {
            return this.events;
        } else {
            return this.events.filter(e => e.eventType === eventType);
        }
    }
}