
export interface LogImport {
    id: number;
    entity: EntityImport;
    startDate: Date;
    endDate: Date;
    event: EventType;
    isSuccess: boolean;
    errorMessage: string;
    information: string;
}

export enum EntityImport {
    customer = 'customer',
    debt = 'debt',
    payment = 'payment',
    agreement = 'agreement'
}

export enum EventType {
    begin = 'begin',
    end = 'end'
}