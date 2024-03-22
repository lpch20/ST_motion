export class PaymentData {
    idCustomer:number = 0;
    ci: string = "";
    signatureDate:Date = new Date();
    expirationDate:Date = new Date();
    paymentDate:Date = new Date();
    amountOfFees:number = 0;
    currentFee:number = 0;
    amount:number = 0;
}