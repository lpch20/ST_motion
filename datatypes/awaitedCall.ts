export class AwaitedCall implements IAwaitedCall {
    id: number = 0;
    date_processed: Date = new Date();
    customerId: string = "";
    source: string = "";
    destination: string = "";

}

export interface IAwaitedCall {
    id: number;
    date_processed: Date;
    customerId: string;
    source: string;
    destination: string;
}