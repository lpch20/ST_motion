export enum Redirect {
    OtherCustomer = "OtherCustomer" ,
    OtherPhone = "OtherPhone"
};

export class EventType {    
    id: number;    
    name:string;
    icon:string;
    redirect:Redirect;
    time:number;
    showMessage:boolean;
    
    
    constructor(id: number,name:string,icon:string,redirect:Redirect,time:number,showMessage:boolean) {
        this.id = id;
        this.name = name;
        this.icon = icon;        
        this.redirect = redirect;
        this.time = time;
        this.showMessage = showMessage;
    }
}