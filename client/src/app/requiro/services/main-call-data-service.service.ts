import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Customer } from '../../../../../datatypes/Customer';

@Injectable()
export class MainCallDataServiceService {
  private messageSource = new BehaviorSubject<string>("default message");  
  private customerCall = new BehaviorSubject<boolean>(false);
  private customerEvent = new BehaviorSubject<{ok:boolean,nextCall:string}>({ok:false,nextCall:""});
  private _endTimerEvent = new BehaviorSubject<boolean>(false);  
  private _customerIdEvent = new BehaviorSubject<number>(0);
  private _customerChange = new BehaviorSubject<Customer>(null);
  private _customerDataChange = new BehaviorSubject<Customer>(null);
  private _logout = new BehaviorSubject<boolean>(false);
  private _player = new BehaviorSubject<boolean>(false);
  private _break = new BehaviorSubject<{break:boolean,breakType:number}>({break:false,breakType:0});
  //Evento cuando se agenda una llamada
  private _shchedule = new BehaviorSubject<boolean>(false);

  customer: Customer;
  currentMessage = this.messageSource.asObservable();
  currentCustomer = this._customerChange.asObservable();
  /**
   * Atributo utilizado para escuchar un cambio en los datos del customer
   */
  customerDataChange$ = this._customerDataChange.asObservable();
  currentCall = this.customerCall.asObservable();
  /**
   * Atributo utilizado para escuchar nuevo evento de customer
   */
  newCustomerEvent = this.customerEvent.asObservable();
  endTimerEvent = this._endTimerEvent.asObservable();
  /**
   * Atributo utilizado para escuchar cambio de customer
   */
  customerIdEvent = this._customerIdEvent.asObservable();
  logoutEvent = this._logout.asObservable();
  playerEvent = this._player.asObservable();
  breakEvent = this._break.asObservable();
  schedule = this._shchedule.asObservable();

  constructor() { }

  sendEndTimerEvent(end:boolean):void{
    this._endTimerEvent.next(end);
  }

  /**
   * Evento que se envia cuado cambia el customer seleccionado.
   * @param id {number} identificador del customer
   */
  sendCustomerIdEvent(id:number):void{
    this._customerIdEvent.next(id);
  }

  sendLogoutEvent():void{
    this._logout.next(true);
  }

  sendPlayerEvent(play:boolean):void{
    this._player.next(play);
  }

  sendNewScheduleEvent(newSchedule:boolean):void{
    this._shchedule.next(newSchedule);
  }

  sendBreakEvent(b:boolean,idTypeBreak:number):void{
    this._break.next({break:b,breakType:idTypeBreak});
  }

  /**
   * Evento que se manda cuando se crea un nuevo evento
   * @param ok 
   * @param nextCall {string} especifica si la proxima llamada es un nuevo cliente o es el mismo con diferente numero
   */
  sendNewCustomerEvent(ok:boolean,nextCall:string):void{
    this.customerEvent.next({ok,nextCall});
  }
  
  makeACall(call:boolean):void{
    this.customerCall.next(call);
  }

  updateCustomerInfo(customer:Customer):void{
    this._customerChange.next(customer);
  }

  /**
   * Evento que se manda cuando existe algun cambio en los datos del customer
   * @param customer 
   */
  sendUpdateCustomerInfo(customer:Customer):void{
    this._customerDataChange.next(customer);
  }

  changeMessage(message: string) {
    this.messageSource.next(message)
  } 

}