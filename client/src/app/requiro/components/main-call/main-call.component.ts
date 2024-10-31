import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ScrollbarDirective } from 'app/core/common/scrollbar/scrollbar.directive';
import { MainCallDataServiceService } from 'app/requiro/services/main-call-data-service.service';
import { Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import { Break } from '../../../../../../datatypes/Break';
import { Customer } from '../../../../../../datatypes/Customer';
import { DebtData } from '../../../../../../datatypes/DebtData';
import { ClientEvent } from '../../../../../../datatypes/clientEvent';
import { Role } from '../../../../../../datatypes/enums';
import { Redirect } from '../../../../../../datatypes/eventType';
import { ResultCode } from '../../../../../../datatypes/result';
import { Router } from '../../../../../node_modules/@angular/router';
import { CustomerModel } from '../../models/customerModel';
import { BreakService } from '../../services/break.service';
import { CallService } from '../../services/call.service';
import { CustomersService } from '../../services/customers.service';
import { EventsService } from '../../services/events.service';
import { ParameterService } from '../../services/parameter.service';
import { SettingModulesService } from '../../services/setting-modules.service';
import { UsersService } from '../../services/users.service';
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
    //lastCall: CallHistory[];
    //newCall: CallHistory;
    //temporizador: number = 0;
    //check: number = 0;
    //time: number = 15;
    //extension_time: number = 360;
    //conn_time: ParameterType;
    //filter_time: ParameterType;
    //extra_time: ParameterType;
    //request_time: ParameterType;
    //autocall_time: ParameterType;
    private customerModel: CustomerModel;
    //Para extender el timer en una segunda llamada
    //extension: boolean = false;

    private subscriptionRedirection: Subscription;
    private customerIdEventSubscription: Subscription;
    //private toggleFlagEventSubscription: Subscription;
    //private toggleCallEventSubscription: Subscription;
    private newCustomerEventSubscription: Subscription;
    private endTimerEventSubscription: Subscription;

    timerActive: boolean;
    //temporizadorActive: boolean;
    //labelTemporizador: string;
    breakActive: boolean;

    TIMER_TIME: number = 10;
    totalTimeRedirect: number = this.TIMER_TIME;
    public timerText: string;
    public timerTime: number;
    public player = false;
    customerDetailHeightStyle = '';
    //countDownCheck: Subscription;
    //countDownCall: Subscription;
    //mensajeEnviado: boolean = false;
    //#endregion fields


    //timer para pantalla principal
    //countDown: Subscription;
    //counter = 30;
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

        localStorage.removeItem('lastCall')
        //this.mensajeEnviado = false;

        // this.startTimerCheck();
        window.localStorage.setItem("callMethod", "NONE");
        //Ubicamos el tiempo para el contador de las llamadas automaticas
        let autocall = localStorage.getItem("autocall_time") || "none";

        /* if (autocall !== "none") {
             this.autocall_time = JSON.parse(autocall);
             this.counter = this.autocall_time.min_value;
 
         }
         else {
             this.counter = 15;
         }
 
 
 
 
         if (localStorage.getItem('time') !== null) {
             if (this.countDownCall)
                 this.countDownCall.unsubscribe();
 
             localStorage.removeItem('time');
         }
          */


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
        console.log("se inició desde el componente pequeño la llamada al index" + this.indexCurrentPhone)
        this.callPhoneByIndex(this.indexCurrentPhone);

        // console.log(this.ready, !this.error);
    }

    changeCurrentIndexPhone(index: number): void {
        this.indexCurrentPhone = index + 1;
    }
    /*
      startTimerCheck() {
  
  
          //Se busca el tiempo de pedido para buscar la ultima llamada
          let cn = localStorage.getItem("request_time") || "none";
          let et = localStorage.getItem("extra_time") || "none";
          if (et !== "none") {
              this.extra_time = JSON.parse(et);
              this.extension_time = this.extra_time.min_value;
          }
          else {
              this.extension_time = 360;
  
          }
  
  
          if (cn !== "none") {
              this.request_time = JSON.parse(cn);
              this.check = this.request_time.min_value * 1000;
              if (this.extension) {
                  this.check = (this.request_time.min_value + this.extension_time) * 1000;
                  this.extension = false;
  
              }
  
          }
          else {
              this.check = 2000;
  
          }
  
          let ft = localStorage.getItem("filter_time") || "none";
          if (ft !== "none") {
              this.filter_time = JSON.parse(ft);
              this.time = this.filter_time.min_value;
          }
          else {
              this.time = 15;
  
          }
  
          //Se crea un intervalo para solicitar el servicio
          this.countDownCheck = interval(this.check).subscribe(() => {
  
              if (typeof this.currentCustomer !== 'undefined' && !this.mensajeEnviado && this.indexCurrentPhone != 0) {
                  console.log("se está llamando a :" + this.currentCustomer.getPhones()[this.indexCurrentPhone - 1])
                  let ph = this.currentCustomer.getPhones()[this.indexCurrentPhone - 1];
                  if (typeof ph !== 'undefined' && ph != null)
                      this.lastCallService(this.currentCustomer.id.toString(), ph, this.time);
  
              }
  
          });
      }
  
      startTimerLlamada() {
  
          if (this.countDownCall)
              this.countDownCall.unsubscribe();
          this.countDownCall = timer(0, 1000).subscribe(() => {
  
              if (this.currentCustomer !== null) {
  
                  localStorage.setItem('time', this.temporizador.toString());
  
  
  
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
  
  
  
  
  
  
                  if (this.temporizador === 0 && this.temporizadorActive) {
  
                      console.log("finished");
                      this.countDownCall.unsubscribe();
                      this.temporizadorActive = false;
                      this.mainCallData.sendActivateEvent(true);
                      this.mensajeEnviado = true;
                      return false;
  
                  }
                  return --this.temporizador;
              }
          });
  
      }
  
    private lastCallService(customerId: string, phone: string, time: number): void {
        if (!this.temporizadorActive) {
            this.parameterService.getLastCall(customerId, phone, time).subscribe(
                response => {

                    if (response.result > 0 && response.data && response.data.length > 0) {

                        this.lastCall = response.data;

                        localStorage.setItem('lastCall', JSON.stringify(response.data[0]));
                        console.log(JSON.stringify(response.data[0]));
                        let cn = localStorage.getItem("conn_time") || "none";
                        this.temporizadorActive = true;
                        if (cn !== "none") {
                            this.conn_time = JSON.parse(cn);
                            this.temporizador = this.conn_time.max_value;
                            localStorage.setItem('time', this.temporizador.toString());

                        }
                        else {
                            this.temporizador = 120;
                            localStorage.setItem('time', this.temporizador.toString());

                        }

                        this.startTimerLlamada();


                    }
                    else {
                        this.temporizadorActive = false;
                    }

                },
                error => {
                    console.error(error);
                }
            );

        }
    }
 */
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
        //this.toggleFlagEventSubscription.unsubscribe();
        // this.toggleCallEventSubscription.unsubscribe();
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
        /*/ escucha cuando se abre la barra
        this.toggleFlagEventSubscription = this.mainCallData.toggleFlagEvent.subscribe(
            responseFlag => {
                if (responseFlag) {
                    if (this.countDown)
                        this.countDown.unsubscribe();
                }
                else {
                    if (this.currentCustomer != null && !this.ready && !this.error && !this.timerActive) {

                        if (this.countDown)
                            this.countDown.unsubscribe();

                        this.startTimerPrincipal();
                    }

                }

            },
            error => {
                console.error(error);
            }
        );
       
        // escucha cuando se llama a un cliente
        this.toggleCallEventSubscription = this.mainCallData.toggleCallEvent.subscribe(
            responseTel => {
                console.log("Se activó el call event con " + responseTel)
                if (responseTel != '')
                    if ((this.indexCurrentPhone - 1) >= 0) {
                        if (responseTel == this.currentCustomer.getPhones()[this.indexCurrentPhone - 1]) {
                            console.log("Se está llamando al mismo numero de telefono, se detiene el timer.")
                            console.log("ResponseTel " + responseTel + " numero actual: " + this.currentCustomer.getPhones()[this.indexCurrentPhone - 1])
                            if (this.countDownCall) {
                                this.countDownCall.unsubscribe();
                                this.temporizadorActive = false;

                            }
                            //Activamos la extensión de tiempo para que no busque de inmediato
                            this.extension = true;

                            if (this.countDownCheck) {
                                this.countDownCheck.unsubscribe();
                            }
                            this.startTimerCheck();
                        }
                    }

            },
            error => {
                console.error(error);
            }
        );
        */
        // Se escucha cuando se guarda un evento de cliente
        // En el caso de compromiso o contacto directo se pasa a otro cliente
        this.newCustomerEventSubscription = this.mainCallData.newCustomerEvent.subscribe(
            response => {
                if (response.ok) {
                    /*
                     if (this.countDown)
                         this.countDown.unsubscribe();
                     if (this.countDownCall)
                         this.countDownCall.unsubscribe();
                     this.extension = true;
 
                     if (this.countDownCheck) {
                         this.countDownCheck.unsubscribe();
                     }
                     this.startTimerCheck();
 
                     this.temporizadorActive = false
                      */

                    if (response.nextCall === Redirect.OtherCustomer) {

                        console.log(" Se cambiará de customer")
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

                                /* if (this.countDown)
                                     this.countDown.unsubscribe();
                                 if (this.countDownCall)
                                     this.countDownCall.unsubscribe();
                                 if (this.countDownCheck)
                                     this.countDownCheck.unsubscribe();
                                 */
                            });
                            console.log("se llamara al queueFinish con el customer " + this.currentCustomer.id);
                            if (typeof this.currentCustomer.id !== 'undefined') {
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
                        console.log("no cargó los debst")
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
        let portfolio = '';
        if (this.currentCustomer && this.currentCustomer.getPhones()[indexPhone] !== undefined) {
            tel = this.currentCustomer.getPhones()[indexPhone];
            if (typeof this.debts[0] !== 'undefined')
                portfolio = this.debts[0].portfolio !== null ? this.debts[0].portfolio : 'none';
            else { portfolio = "none" }
            console.log("el portfolio es:" + portfolio);
            this.callService.makeCallFromAgent(this.currentCustomer.id, tel, this.currentCustomer.ci, portfolio).subscribe(
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
                //this.mensajeEnviado = false;
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
                    //this.mensajeEnviado = false;
                    this.ready = false;
                    if (response.data && response.data.length > 0) {
                        this.customers = response.data;
                        const firstCustomer = response.data[0];
                        if (firstCustomer) {
                            this.setCurrentCustomer(firstCustomer.id);
                            console.log("SE seteó el customer")
                        }


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
                /* if (this.countDown)
                     this.countDown.unsubscribe();
 
 
                 let autocall = localStorage.getItem("autocall_time") || "none";
                 if (autocall !== "none") {
                     this.autocall_time = JSON.parse(autocall);
                     this.counter = this.autocall_time.min_value;
 
                 }
                 else {
                     this.counter = 15;
                 }
 
 
 
                 this.startTimerPrincipal();
                 //this.startTimerCheck();
                 */

                this.currentCustomer = this.customerModel.customer;

                //Como la llamada de debts no es asincrona, movemos el metodo para emular la asincronia
                this.customerService.getCustomerDebtById(this.currentCustomer.id).subscribe(response => {
                    if (response.result == ResultCode.OK) {


                        this.debts = response.data;
                        this.idsPayment = this.debts.map(d => d.idPay).filter(d => d);
                        this.mainCallData.updateCustomerInfo(this.currentCustomer);
                    }
                    else {
                        // TODO: complete error handling
                        console.error(response);
                    }
                }, err => {
                    // TODO: complete error handling
                    console.error(err);
                });


                //this.loadDebt();
            }
        });
    }

    timerFinished(finished) {
        this.mainCallData.sendEndTimerEvent(finished);
    }

    public isMoraTardia() {
        return localStorage.getItem('accountId') != '3';
    }

    private async loadDebt() {
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
    /*
    startTimerPrincipal() {

        this.countDown = timer(0, 1000).subscribe(() => {

            if (this.currentCustomer != null && !this.ready && !this.error && !this.timerActive) {
                if (this.counter === 0) {

                    this.ready = true;
                    this.countDown.unsubscribe();
                    console.log("quizá no cargó los debst")
                    this.callPhoneByIndex(this.indexCurrentPhone);
                    window.localStorage.setItem("currentCustomer", this.currentCustomer.id.toString());
                    window.localStorage.setItem("callMethod", "AUTOTIMER");
                    return false;
                }
                return --this.counter;
            }
        });
    }
    */
}
