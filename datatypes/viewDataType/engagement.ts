export class Engagement {
    id: number = 0;
    idEvent: number = 0;
    idCustomer: number = 0;
    paymentPromiseDate: Date = new Date();
    numberOfFees: number = 0;
    amountFees: number = 0;
    agreedDebt: number = 0;
    initialDelivery: number = 0;
    idBranchOffice: number = 0;
    callAgain: Date = new Date()
    annotation: string = "";
    phoneNumber: string = "";
}