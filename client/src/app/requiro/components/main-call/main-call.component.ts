import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ScrollbarDirective } from 'app/core/common/scrollbar/scrollbar.directive';
import { MainCallDataServiceService } from 'app/requiro/services/main-call-data-service.service';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import { Subscription } from 'rxjs/Rx';
import { Break } from '../../../../../../datatypes/Break';
import { ClientEvent } from '../../../../../../datatypes/clientEvent';
import { Customer } from '../../../../../../datatypes/Customer';
import { DebtData } from '../../../../../../datatypes/DebtData';
import { Role } from '../../../../../../datatypes/enums';
import { Redirect } from '../../../../../../datatypes/eventType';
import { ResultCode } from '../../../../../../datatypes/result';
import { Router } from '../../../../../node_modules/@angular/router';
import { CustomerModel } from '../../models/customerModel';
import { BreakService } from '../../services/break.service';
import { CallService } from '../../services/call.service';
import { CustomersService } from '../../services/customers.service';
import { EventsService } from '../../services/events.service';
import { SettingModulesService } from '../../services/setting-modules.service';
import { UsersService } from '../../services/users.service';
import { ParameterService } from '../../services/parameter.service';
import { CallHistory } from '../../../../../../datatypes/CallHistory';
import { ParameterType } from '../../../../../../datatypes/ParameterType';
import { Subject, interval, timer } from 'rxjs';
@Component({
    selector: 'app-main-call',
    templateUrl: './main-call.component.html',
    styleUrls: ['./main-call.component.css']
})
export class MainCallComponent implements OnInit, OnDestroy {

    //#region fields
    @ViewChild('contentScroll', { read: ScrollbarDirective }) private contentScroll: ScrollbarDirective;

    currentCustomer: Customer;
    indexCurrentPhone: number = 0;
    newCustomerEvent: boolean = false;
    ready: boolean = false;
    _showDetails: boolean = false;
    customers: Customer[];
    messageError: string = '';
    error: boolean = false;
    debts: DebtData[];
    idsPayment: string[];
    lastCall: CallHistory[];
    newCall: CallHistory;
    temporizador: number = 0;
    check: number = 0;
    conn_time:ParameterType;
    request_time:ParameterType;
    autocall_time:ParameterType;
    private customerModel: CustomerModel;

    private subscriptionRedirection: Subscription;
    private customerIdEventSubscription: Subscription;
    private toggleFlagEventSubscription: Subscription;
    private newCustomerEventSubscription: Subscription;
    private endTimerEventSubscription: Subscription;

    timerActive: boolean;
    temporizadorActive: boolean;
    labelTemporizador: string;
    breakActive: boolean;

    TIMER_TIME: number = 10;
    totalTimeRedirect: number = this.TIMER_TIME;
    public timerText: string;
    public timerTime: number;
    public player = false;
    customerDetailHeightStyle = '';
    countDownCheck: Subscription;
    countDownCall: Subscription;
    //#endregion fields


    //timer para pantalla principal
    countDown: Subscription;
    counter=30;
    //#region constructor
    constructor(
        private mainCallData: MainCallDataServiceService,
        private customerService: CustomersService,
        private callService: CallService,
        private eventService: EventsService,
        private settingModuleService: SettingModulesService,
        private breakService: BreakService,
        private router: Router,
        private usersService: UsersService,
        private parameterService: ParameterService
    ) {
        this.customerModel = new CustomerModel(customerService, eventService);
    }
    //#endregion constructor

    //#region implementations of OnInit, OnDestroy
    ngOnInit(): void {


       // this.startTimerCheck();
       window.localStorage.setItem("callMethod","NONE");
        //Ubicamos el tiempo para el contador de las llamadas automaticas
        let autocall=localStorage.getItem("autocall_time") || "none";
        if(autocall!=="none")
        { 
            this.autocall_time=JSON.parse(autocall);
            this.counter=this.autocall_time.min_value;
            
        }
        else
        {
            this.counter=15;    
        }




        if(localStorage.getItem('time')!==null)
            {
                if(this.countDownCall)
                   this.countDownCall.unsubscribe();
                //this.startTimerLlamada();
            }
             


        this.breakService.getLastBreakByCurrentUser().subscribe(
            response => {
                if (response.result > 0 && response.data && response.data.length > 0) {
                    const breakResult: Break = response.data[0];
                    if (breakResult.init) {
                        this.router.navigate(['pausa']);
                    } else {
                        this.timerActive = this.settingModuleService.getStatusModule('timer');
                        this.breakActive = this.settingModuleService.getStatusModule('break');
                        this.init();
                    }
                }
            },
            error => {
                console.error(error);
            }
        );
    }

    ngOnDestroy() {
        this.cleanSubscriptions();
    }
    //#endregion implementations of OnInit, OnDestroy

    showDetail($event): void {
        this._showDetails = $event;
    }

    initCall($event): void {
        this.ready = $event;
        this.callPhoneByIndex(this.indexCurrentPhone);

        console.log(this.ready, !this.error);
    }

    changeCurrentIndexPhone(index: number): void {
        this.indexCurrentPhone = index + 1;
    }

    startTimerCheck() {
  
        
        //Se busca el tiempo de pedido para buscar la ultima llamada
        let cn=localStorage.getItem("request_time") || "none";
        if(cn!=="none")
            { 
                this.request_time=JSON.parse(cn);
                this.check=this.request_time.min_value*1000;
               
            }
            else
            {
                this.check=2000;
               
            }

         //Se crea un intervalo para solicitar el servicio
        this.countDownCheck = interval(this.check).subscribe(() => {
        
            if(typeof this.currentCustomer!=='undefined')
                this.lastCallService(this.currentCustomer.id.toString());

        });
      }

   startTimerLlamada() {
  
         this.countDownCall = timer(0, 1000).subscribe(() => {
        
           if(this.currentCustomer!==null)
            {

            localStorage.setItem('time',this.temporizador.toString());



            const minute = Math.floor(this.temporizador / 60);
            let minuteString: string;
            if (minute < 10) {
              minuteString = '0' + minute;
            } else {
              minuteString = minute.toString();
            }
      
            const second = this.temporizador % 60;
            let secondString: string;
            if (second < 10) {
              secondString = '0' + second;
            } else {
              secondString = second.toString();
            }
            this.labelTemporizador = minuteString + ':' + secondString;






          if (this.temporizador === 0) {
            console.log("finished");
            this.countDownCall.unsubscribe();
            return false;
          }
          return --this.temporizador;
        }
    });
   
}

private lastCallService(customerId:string):void{

    this.parameterService.getLastCall(customerId).subscribe(
        response => {
            
            if (response.result > 0 && response.data && response.data.length > 0) {
               this.lastCall= response.data;
              
               if(localStorage.getItem("lastCall")===null)
               {
                localStorage.setItem('lastCall', JSON.stringify(response.data[0]));
                console.log(JSON.stringify(response.data[0]));
                let cn=localStorage.getItem("conn_time") || "none";
                this.temporizadorActive=true;
                if(cn!=="none")
                    { 
                        this.conn_time=JSON.parse(cn);
                        this.temporizador=this.conn_time.max_value;
                        localStorage.setItem('time',this.temporizador.toString());
                
                    }
                    else
                    {
                        this.temporizador=600;
                        localStorage.setItem('time',this.temporizador.toString());
                
                    }
                this.startTimerLlamada();
               }
               else
               {

                let callStorage=localStorage.getItem('lastCall')||"none";
                if(callStorage!=="none")
                 {
                        this.newCall=JSON.parse(callStorage);
                        if(this.newCall.customerId!==customerId)
                        {
                            localStorage.removeItem("lastCall");
                            localStorage.removeItem("time");
                            this.temporizadorActive=false;
                        }
                        else
                        {
                            this.temporizadorActive=true;
                             this.temporizador=parseInt(localStorage.getItem('time')||"600");
                             if(this.countDownCall) this.countDownCall.unsubscribe();
                             this.startTimerLlamada();
                        }

                }
                
               
               }
            
             
            }
            else
            {
                this.temporizadorActive=false;
            }
           
        },
        error => {
            console.error(error);
        }
    );


}

    stopRedirect(): void {
        this.subscriptionRedirection.unsubscribe();
        this.totalTimeRedirect = this.TIMER_TIME;
        if (this.currentCustomer) {
            this.currentCustomer.eventData = null;
        }
    }

    private init(): void {
        this.mainCallData.playerEvent.subscribe(
            result => {
                this.player = result;
            },
            error => {
                console.error(error);
            }
        );
    }

    ngAfterViewInit() {
        this.initMainCall();
    }

    private initMainCall(): void {
        this.getNextCustomers();
        this.initListeningEvents();
    }

    private cleanSubscriptions(): void {
        this.customerIdEventSubscription.unsubscribe();
        this.toggleFlagEventSubscription.unsubscribe();
        this.newCustomerEventSubscription.unsubscribe();
        this.endTimerEventSubscription.unsubscribe();
    }

    private initListeningEvents(): void {
        this.mainCallData.customerDataChange$.subscribe(
            customerChanged => {
                console.log(customerChanged);
            },
            error => {
                console.error(error);
            }
        );

        // escucha cuando se selecciona un cliente para mostrar en pantalla
        this.customerIdEventSubscription = this.mainCallData.customerIdEvent.subscribe(
            responseCustomerId => {
                if (responseCustomerId > 0) {
                   
                    this.setCurrentCustomer(responseCustomerId);
                }
            },
            error => {
                console.error(error);
            }
        );
      // escucha cuando se abre la barra
        this.toggleFlagEventSubscription = this.mainCallData.toggleFlagEvent.subscribe(
            responseFlag => {
                if (responseFlag) {
                    if(this.countDown)
                         this.countDown.unsubscribe();
                }
                else
                {
                    if(this.currentCustomer!=null && !this.ready && !this.error && !this.timerActive)
                        {

                            if(this.countDown)
                                this.countDown.unsubscribe();

                            this.startTimerPrincipal();
                        }
                    
                }

            },
            error => {
                console.error(error);
            }
        );

        // Se escucha cuando se guarda un evento de cliente
        // En el caso de compromiso o contacto directo se pasa a otro cliente
        this.newCustomerEventSubscription = this.mainCallData.newCustomerEvent.subscribe(
            response => {
                if (response.ok) {
                    if (response.nextCall === Redirect.OtherCustomer) {
                        alert("se dio next")
                        // TODO arreglar solucion provisoria
                        setTimeout(() => {
                            this.ready = false;
                            if(this.countDown)
                                this.countDown.unsubscribe();
                            this.startTimerPrincipal();
                        });
                        this.indexCurrentPhone = 0;
                        this.getNextCustomers();
                    } else if (response.nextCall === Redirect.OtherPhone && this.currentCustomer) {
                        if (this.indexCurrentPhone < this.currentCustomer.getPhones().length) {
                            this.newCustomerEvent = true;
                            this.timerTime = this.TIMER_TIME;

                            this.eventService.getEventByCustomer(this.currentCustomer.id).subscribe(
                                eventByCustomerRes => {
                                    this.customerService.getCustomersById(this.currentCustomer.id).subscribe(
                                        customerRes => {
                                            if (customerRes.result > 0) {
                                                const c: Customer = customerRes.data;
                                                this.currentCustomer.setCampaign(c.idCampaign);
                                                this.currentCustomer.events = eventByCustomerRes.data;
                                                this.callPhoneByIndex(this.indexCurrentPhone);
                                            }
                                        },
                                        error => {
                                            console.error(error);
                                        }
                                    );
                                },
                                error => {
                                    console.error(error);
                                }
                            );

                        } else {
                            // TODO arreglar solucion provisoria
                            setTimeout(() => {
                                this.ready = false;
                                if(this.countDown)
                                    this.countDown.unsubscribe();
                                this.startTimerPrincipal();
                            });
                            this.customerService.setItemQueueFinish(this.currentCustomer.id).subscribe(
                                resultItemFinshed => {
                                    this.getNextCustomers();
                                },
                                error => {
                                    console.error(error);
                                }
                            );
                        }
                    }
                }
            },
            error => {
                console.error(error);
            }
        );

        this.endTimerEventSubscription = this.mainCallData.endTimerEvent.subscribe(
            t => {
                console.log('endTimerEvent', t);
                if (t) {
                    // TODO arreglar solucion provisoria
                    setTimeout(() => {
                        this.ready = true;
                        this.callPhoneByIndex(this.indexCurrentPhone);
                    });
                    this.mainCallData.sendEndTimerEvent(false);
                }
            },
            error => {
                console.error(error);
            }
        );
    }

    private callPhoneByIndex(indexPhone: number): void {
        let tel = '';
        if (this.currentCustomer && this.currentCustomer.getPhones()[indexPhone] !== undefined) {
            tel = this.currentCustomer.getPhones()[indexPhone];
            this.callService.makeCallFromAgent(this.currentCustomer.id, tel,this.currentCustomer.ci).subscribe(
                response => {
                    if (response.result === ResultCode.Error) {
                        alert(response.message);
                    }
                },
                error => {
                    alert(error.message);
                }
            );
            // Todo sacar chanchada
            setTimeout(() => {
                this.currentCustomer.currentIndexPhone = this.indexCurrentPhone;
                this.currentCustomer.setCurrentPhone();
                this.indexCurrentPhone++;
            });
        } else {
            console.log('No tiene telefono para llamar', indexPhone);
        }
    }

    private annotation(tel: string): void {
        if (this.currentCustomer) {
            this.currentCustomer.eventData = { idCampaign: this.currentCustomer.idCampaign, event: new ClientEvent() };
            this.currentCustomer.eventData.event.phone = tel;
        }
    }

    private getNextCustomers() {
        this.customerService.getNextCustomers().subscribe(
            response => {
                if (response.result === ResultCode.OK) {
                    if (response.data && response.data.length > 0) {
                        this.customers = response.data;
                        const firstCustomer = response.data[0];
                        if (firstCustomer) {
                            this.setCurrentCustomer(firstCustomer.id); 
                            console.log("SE seteó el customer")                          
                        }                       
                         //SE CAMBIó DE CUSTOMER Y NO PASÖ POR EL TIMER
                         console.log("SE CAMBIó DE CUSTOMER Y NO PASÖ POR EL TIMER")
                        

                    } else { // no existen otros customer que llamar

                        this.usersService.getRolCurrentUser().subscribe(
                            rolCurrentUser => {
                                if (rolCurrentUser.result
                                    && rolCurrentUser.data !== undefined
                                    && rolCurrentUser.data[0].rol_id === Role.Agent) {
                                    this.error = true;
                                    this.messageError = "No hay más clientes para llamar";
                                }

                            }
                        );
                    }
                } else {
                    // TODO SACAR HARCODEO MACHASO
                    this.usersService.getRolCurrentUser().subscribe(
                        rolCurrentUser => {
                            if (rolCurrentUser.result
                                && rolCurrentUser.data !== undefined
                                && rolCurrentUser.data[0].rol_id === Role.Agent) {
                                this.error = true;
                                this.messageError = "No hay más clientes para llamar";
                            }
                        }
                    );
                }
            },
            error => {
                console.error(error);
            }
        );
    }

    private setCurrentCustomer(id: number): void {
        this.customerModel.setCurrentCustomer(id, (response: any) => {
            if (response.result > 0) {
                this.indexCurrentPhone = 0;
                //borramos la instancia anteior para suscribir una nueva
                if(this.countDown)
                    this.countDown.unsubscribe();
               
               
                let autocall=localStorage.getItem("autocall_time") || "none";
                if(autocall!=="none")
                { 
                    this.autocall_time=JSON.parse(autocall);
                    this.counter=this.autocall_time.min_value;
                    
                }
                else
                {
                    this.counter=15;    
                }
        


                this.startTimerPrincipal();   
                
                    

                this.currentCustomer = this.customerModel.customer;

                if(this.ready && !this.error)
                {
                    if(typeof localStorage.getItem("currentCustomer")==='undefined' || 
                            localStorage.getItem("currentCustomer")!==this.currentCustomer.id.toString())
                                {
                                    console.log("se llamará otro customer")
                                    window.localStorage.setItem("currentCustomer",this.currentCustomer.id.toString());
                                    if(this.indexCurrentPhone!==null)
                                    this.callPhoneByIndex(this.indexCurrentPhone);
                        

                                }
                }

                
                this.mainCallData.updateCustomerInfo(this.currentCustomer);
                this.loadDebt();
            }
        });
    }

    timerFinished(finished) {
        this.mainCallData.sendEndTimerEvent(finished);
    }

    public isMoraTardia() {
        return localStorage.getItem('accountId') != '3';
    }

    private loadDebt() {
        this.customerService.getCustomerDebtById(this.currentCustomer.id).subscribe(response => {
            if (response.result == ResultCode.OK) {
                this.debts = response.data;
                this.idsPayment = this.debts.map(d => d.idPay).filter(d => d);
            }
            else {
                // TODO: complete error handling
                console.error(response);
            }
        }, err => {
            // TODO: complete error handling
            console.error(err);
        });
    }
    startTimerPrincipal() {
  
        this.countDown = timer(0, 1000).subscribe(() => {
        
         if(this.currentCustomer!=null && !this.ready && !this.error && !this.timerActive)
            {  
                if (this.counter === 0) {
                    
                    this.ready=true;
                    this.countDown.unsubscribe();
                    this.callPhoneByIndex(this.indexCurrentPhone);
                    window.localStorage.setItem("currentCustomer",this.currentCustomer.id.toString());
                    window.localStorage.setItem("callMethod","AUTOTIMER");
                    return false;
                }
                return --this.counter;
            }
        });
      }
}
