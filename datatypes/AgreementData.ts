export class AgreementData {
    idCustomer:number = 0;
    amountOfDebt:number = 0;
    amountOfFees: number = 0;
    lastFeePaid:number = 0;
    amountOfFeesUnpaid:number = 0;
    currentFee:number = 0;
    firstFeeUnpaid:Date = new Date();
    lastFeeUnpaid:Date = new Date();  
    dateSigned:Date = new Date();
    amountSigned:number = 0;
}