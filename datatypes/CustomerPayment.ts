export class CustomerPayment {
    idCustomer: number = 0;
    ci: string = "";
    signatureDate: Date = new Date();
    amountOfFees: number = 0;
    expirationDate: Date = new Date();
    paymentDate: Date = new Date();
    amount: number = 0;
    currentFee: number = 0;
}