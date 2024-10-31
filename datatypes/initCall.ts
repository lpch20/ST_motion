export class InitCall implements IInitCall {
id: number = 0;   
start: Date = new Date(); 
customerId : string = "";      
source : string = "";     
destination : string = "";       

}

export interface IInitCall{
id: number;   
start: Date;
customerId : string;     
source : string;     
destination : string; 
}