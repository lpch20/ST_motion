export class CallHistory implements ICallHistory {
id: number = 0;   
start: Date = new Date();
end: Date = new Date(); 
customerId : string = "";    
callId : string = "";    
totalTime : number = 0;    
source : string = "";     
destination : string = "";     
status: number = 0;  

}

export interface ICallHistory {
id: number;   
start: Date;
end: Date; 
customerId : string;    
callId : string;    
totalTime : number;    
source : string;     
destination : string;     
status: number; 
}