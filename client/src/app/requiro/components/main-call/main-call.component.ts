import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ScrollbarDirective } from 'app/core/common/scrollbar/scrollbar.directive';
import { MainCallDataServiceService } from 'app/requiro/services/main-call-data-service.service';
import { interval, timer } from 'rxjs';
import { Subscription } from 'rxjs/Rx';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/map';
import { Break } from '../../../../../../datatypes/Break';
import { CallHistory } from '../../../../../../datatypes/CallHistory';
import { Customer } from '../../../../../../datatypes/Customer';
import { DebtData } from '../../../../../../datatypes/DebtData';
import { ParameterType } from '../../../../../../datatypes/ParameterType';
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
    @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;
    @ViewChild('callAPIInactive') callAPIInactive: TemplateRef<any>;

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
    //newCall: CallHistory;

    rolId: string = '0';
    check: number = 0;
    time: number = 15;
    extension_time: number = 360;
    conn_time: ParameterType;
    inactive_time: ParameterType;
    corto_time: ParameterType;
    option_time: ParameterType;
    filter_time: ParameterType;
    extra_time: ParameterType;
    request_time: ParameterType;
    autocall_time: ParameterType;
    private customerModel: CustomerModel;
    //Para extender el timer en una segunda llamada
    extension: boolean = false;

    private subscriptionRedirection: Subscription;
    private customerIdEventSubscription: Subscription;
    //private toggleFlagEventSubscription: Subscription;
    private toggleCallEventSubscription: Subscription;
    private toggleAddObservacionSubscription: Subscription;
    private toggleCallEventCortoSubscription: Subscription;
    private newCustomerEventSubscription: Subscription;
    private endTimerEventSubscription: Subscription;

    timerActive: boolean;
    timerPrincipal: boolean;
    optionTimerActive: boolean;
    temporizadorActive: boolean;
    temporizadorCortoActive: boolean;
    temporizadorInactividadActive: boolean;
    optionTemporizadorActive: boolean;
    labelTemporizador: string;
    labelTemporizadorCorto: string;
    labelTemporizadorInactividad: string;
    optionLabelTemporizador: string;
    optionTemporizador: number = 0;
    temporizador: number = 0;
    temporizadorCorto: number = 0;
    temporizadorInactividad: number = 0;
    breakActive: boolean;

    TIMER_TIME: number = 10;
    totalTimeRedirect: number = this.TIMER_TIME;
    public timerText: string;
    public timerTime: number;
    public player = false;
    customerDetailHeightStyle = '';
    countDownCheck: Subscription;
    countDownInactivity: Subscription;
    countDownCall: Subscription;
    countDownCorto: Subscription;
    countDownOption: Subscription;
    mensajeEnviado: boolean = false;
    //#endregion fields

    //FLAG PARA SABER SI LA LLAMADA FUÉ INSERTADA POR TELEDATA
    callFlag: boolean = false;

    //timer para pantalla principal
    countDown: Subscription;
    counter = 30;
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
        private parameterService: ParameterService,
        private dialog: MatDialog
    ) {
        this.customerModel = new CustomerModel(customerService, eventService);
    }
    //#endregion constructor

    //#region implementations of OnInit, OnDestroy
    ngOnInit(): void {

        console.log("entro al init del componente")
        this.mensajeEnviado = false;


        let rol = window.localStorage.getItem("rolId") || "none";
        if (rol !== "none") {
            this.rolId = window.localStorage.getItem("rolId");

        }
        else {
            this.rolId = '0'
        }



        this.unsuscribeEvents()
        window.localStorage.setItem("callMethod", "NONE");



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
        console.log("se destruyó el componente")
        this.unsuscribeEvents();
        this.cleanSubscriptions();
    }
    //#endregion implementations of OnInit, OnDestroy

    cancelOptionBehavior() {

        let cn = window.localStorage.getItem("option_time") || "none";
        this.optionTemporizadorActive = true;


        if (cn !== "none") {
            this.option_time = JSON.parse(cn);
            this.optionTemporizador = this.option_time.max_value;
            window.localStorage.setItem('optionTime', this.optionTemporizador.toString());

        }
        else {
            this.optionTemporizador = 120;
            window.localStorage.setItem('optionTime', this.optionTemporizador.toString());

        }
        if (this.countDownCheck) {
            this.countDownCheck.unsubscribe();
        }
        if (this.countDownInactivity) {
            this.countDownInactivity.unsubscribe();
            this.temporizadorInactividadActive = false;

        }
        this.startTimerOption();

    }

    openDialog(): void {

        let dialogRef = this.dialog.open(this.callAPIDialog, { disableClose: true });
        dialogRef.afterOpen().subscribe(result => {


        });
        let closed = false;
        setTimeout(() => {
            if (!closed) {
                if (!this.optionTemporizadorActive) {
                    console.log("no desea llamar el mismo cliente aut")
                    this.cancelOptionBehavior();
                    dialogRef.close()
                }


            }
        }, 10000);

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                if (result === 'yes') {
                    closed = true;
                    this.parameterService.updateLastCall(this.currentCustomer.id.toString()).subscribe(
                        response => {
                            // console.log("Se actualizó el registro");
                            this.unsuscribeEvents();
                            this.callFlag = false;
                            this.startTimerCheck();
                            this.startTimerInactividad();
                        });

                    // console.log('User clicked yes.');
                } else if (result === 'no') {
                    closed = true;
                    if (!this.optionTemporizadorActive) {
                        console.log("no desea llamar el mismo cliente")
                        this.cancelOptionBehavior();
                    }

                    // console.log('User clicked no.');
                }
            }
        });
    }
    openDialogInactive(): void {

        let dialogRef = this.dialog.open(this.callAPIInactive, { disableClose: true });
        dialogRef.afterOpen().subscribe(result => {

            if (this.countDownCheck) {
                this.countDownCheck.unsubscribe();
            }

            if (this.countDownInactivity) {
                this.countDownInactivity.unsubscribe();
            }


        });
        let closedInactive = false;
        setTimeout(() => {

            if (!closedInactive) {
                if (!this.temporizadorInactividadActive) {
                    console.log("no hay mas llamadas aut");
                    this.cancelOptionBehavior();
                    dialogRef.close()
                }
            }
        }, 10000);

        dialogRef.afterClosed().subscribe(result => {
            if (result !== undefined) {
                if (result === 'yes') {
                    closedInactive = true;
                    if (!this.temporizadorInactividadActive) {
                        this.cancelOptionBehavior();
                        console.log("no hay mas llamadas");
                    }

                } else if (result === 'no') {
                    closedInactive = true;

                    this.startTimerCheck();
                    this.startTimerInactividad();


                }
            }
        });
    }


    showDetail($event): void {
        console.log("se activó el show details")
        this._showDetails = $event;
    }

    initCall($event): void {
        this.ready = $event;
        console.log("se inició desde el componente pequeño la llamada al index" + this.indexCurrentPhone)
        this.timerPrincipal = false;
        this.unsuscribeEvents();
        this.startTimerCheck();
        this.startTimerInactividad();
        this.callPhoneByIndex(this.indexCurrentPhone);

        // console.log(this.ready, !this.error);
    }

    changeCurrentIndexPhone(index: number): void {
        this.timerPrincipal = false;
        this.unsuscribeEvents();
        this.ready = true;
        this.startTimerCheck();
        this.startTimerInactividad();
        this.indexCurrentPhone = index + 1;
    }

    startTimerCheck() {


        //Se busca el tiempo de pedido para buscar la ultima llamada
        let cn = window.localStorage.getItem("request_time") || "none";
        let et = window.localStorage.getItem("extra_time") || "none";
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

        //filter time se utiliza para saber cuanto tiempo minimo debe ser una llamada para ser tomada como positiva
        let ft = window.localStorage.getItem("filter_time") || "none";
        if (ft !== "none") {
            this.filter_time = JSON.parse(ft);
            this.time = this.filter_time.min_value;
        }
        else {
            this.time = 15;

        }

        //Se crea un intervalo para solicitar el servicio
        console.log("se inició el check")
        this.countDownCheck = interval(this.check).subscribe(() => {

            if (this.ready && !this.error) {
                if (typeof this.currentCustomer !== 'undefined' && !this.mensajeEnviado && this.indexCurrentPhone != 0) {
                    console.log("se está llamando a :" + this.currentCustomer.getPhones()[this.indexCurrentPhone - 1])

                    this.lastCallService(this.currentCustomer.id.toString(), this.time);


                }
            }

        });
    }
    startTimerInactividad() {

        if (this.countDownInactivity)
            this.countDownInactivity.unsubscribe();

        //Se busca el tiempo configurado para inactividad
        let cn = window.localStorage.getItem("inactive_time") || "none";
        this.temporizadorInactividadActive = true;


        if (cn !== "none") {
            this.inactive_time = JSON.parse(cn);
            this.temporizadorInactividad = this.inactive_time.max_value;
            window.localStorage.setItem('i_time', this.temporizadorInactividad.toString());

        }
        else {
            this.temporizadorInactividad = 360;
            window.localStorage.setItem('time', this.temporizadorInactividad.toString());

        }
        this.countDownInactivity = timer(0, 1000).subscribe(() => {

            if (this.ready && !this.error) {
                //console.log("Temporizador inactividad: " + this.temporizadorInactividad);
                if (this.currentCustomer !== null) {

                    window.localStorage.setItem('i_time', this.temporizadorInactividad.toString());



                    const minute = Math.floor(this.temporizadorInactividad / 60);
                    let minuteString: string;
                    if (minute < 10) {
                        minuteString = '0' + minute;
                    } else {
                        minuteString = minute.toString();
                    }

                    const second = this.temporizadorInactividad % 60;
                    let secondString: string;
                    if (second < 10) {
                        secondString = '0' + second;
                    } else {
                        secondString = second.toString();
                    }
                    this.labelTemporizadorInactividad = minuteString + ':' + secondString;


                    if (this.temporizadorInactividad === 0 && this.temporizadorInactividadActive) {

                        console.log("El timer de inactividad llegó a cero");
                        this.temporizadorInactividad = 100;
                        this.countDownInactivity.unsubscribe();
                        this.temporizadorInactividadActive = false;
                        this.openDialogInactive()
                        return false;

                    }
                    return --this.temporizadorInactividad;
                }
            }
        });
    }

    startTimerOption() {

        if (this.countDownOption)
            this.countDownOption.unsubscribe();

        this.countDownOption = timer(0, 1000).subscribe(() => {

            if (this.currentCustomer !== null) {

                window.localStorage.setItem('timeOption', this.optionTemporizador.toString());



                const minute = Math.floor(this.optionTemporizador / 60);
                let minuteString: string;
                if (minute < 10) {
                    minuteString = '0' + minute;
                } else {
                    minuteString = minute.toString();
                }

                const second = this.optionTemporizador % 60;
                let secondString: string;
                if (second < 10) {
                    secondString = '0' + second;
                } else {
                    secondString = second.toString();
                }
                this.optionLabelTemporizador = minuteString + ':' + secondString;


                if (this.optionTemporizador === 0 && this.optionTemporizadorActive) {

                    this.optionTemporizador = 100;
                    console.log("el timer option llegó a cero");
                    if (this.countDownOption) {
                        this.countDownOption.unsubscribe();

                    }
                    this.optionTemporizadorActive = false;
                    this.mainCallData.sendOptionEvent(true);
                    this.mainCallData.sendOptionEvent(false);
                    return false;

                }
                return --this.optionTemporizador;
            }
        });



    }


    startTimerLlamada() {

        if (this.countDownCall) {
            this.countDownCall.unsubscribe();
            this.temporizadorActive = false
        }
        this.countDownCall = timer(0, 1000).subscribe(() => {

            if (this.currentCustomer !== null) {

                window.localStorage.setItem('time', this.temporizador.toString());



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

                    this.temporizador = 100;
                    console.log("El timer largo llegó a cero");
                    this.countDownCall.unsubscribe();
                    this.temporizadorActive = false;
                    this.temporizador = -1;
                    this.mainCallData.sendActivateEvent(true);
                    this.mainCallData.sendActivateEvent(false);
                    this.mensajeEnviado = true;
                    return false;

                }
                return --this.temporizador;
            }
        });

    }

    startTimerCorto() {

        if (this.countDownCorto) {
            this.countDownCorto.unsubscribe();
            this.temporizadorCortoActive = false
        }
        this.countDownCorto = timer(0, 1000).subscribe(() => {

            if (this.currentCustomer !== null) {

                window.localStorage.setItem('cortotime', this.temporizadorCorto.toString());



                const minute = Math.floor(this.temporizadorCorto / 60);
                let minuteString: string;
                if (minute < 10) {
                    minuteString = '0' + minute;
                } else {
                    minuteString = minute.toString();
                }

                const second = this.temporizadorCorto % 60;
                let secondString: string;
                if (second < 10) {
                    secondString = '0' + second;
                } else {
                    secondString = second.toString();
                }
                this.labelTemporizadorCorto = minuteString + ':' + secondString;

                if (this.temporizadorCorto === 0 && this.temporizadorCortoActive) {

                    console.log("El timer corto llegó a cero");
                    this.temporizadorCorto = 100;
                    this.countDownCorto.unsubscribe();
                    this.temporizadorCortoActive = false;
                    this.mainCallData.sendActivateEventCorto(true);
                    this.mainCallData.sendActivateEventCorto(false);
                    this.mensajeEnviado = true;
                    return false;

                }
                return --this.temporizadorCorto;
            }
        });

    }

    private lastCallService(customerId: string, time: number): void {
        if (!this.temporizadorActive) {
            this.parameterService.getLastCall(customerId, time).subscribe(
                response => {

                    if (response.result > 0 && response.data && response.data.length > 0) {

                        this.lastCall = response.data;

                        window.localStorage.setItem('lastCall', JSON.stringify(response.data[0]));

                        this.callFlag = true;

                        if (this.countDownInactivity) {
                            this.countDownInactivity.unsubscribe();
                            this.temporizadorInactividadActive = false;

                        }
                        if (this.dialog.openDialogs.length == 0)
                            this.openDialog();


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
        this.toggleCallEventSubscription.unsubscribe();
        this.toggleAddObservacionSubscription.unsubscribe();
        this.toggleCallEventCortoSubscription.unsubscribe();
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
       */
        //Escucha cuando se envia una observación y se proceden a detener los timer
        this.toggleAddObservacionSubscription = this.mainCallData.toggleAddObervacionEvent.subscribe(
            response => {
                if (response) {

                    this.unsuscribeEvents();

                    this.parameterService.updateLastCall(this.currentCustomer.id.toString()).subscribe(
                        response => {
                            // console.log("Se actualizó el registro");
                            this.callFlag = false;
                            if (this.rolId != '1') {
                                this.startTimerCheck();
                                this.startTimerInactividad();
                            }
                        });



                }
            },
            error => {
                console.error(error);
            }
        );

        // escucha cuando se termina el tiempo de seleccionar la opcion
        this.toggleCallEventSubscription = this.mainCallData.toggleCallEvent.subscribe(
            response => {
                if (response) {
                    // console.log("Se activa el timer")

                    this.unsuscribeEvents();

                    let cn = window.localStorage.getItem("conn_time") || "none";
                    this.temporizadorActive = true;


                    if (cn !== "none") {
                        this.conn_time = JSON.parse(cn);
                        this.temporizador = this.conn_time.max_value;
                        window.localStorage.setItem('time', this.temporizador.toString());

                    }
                    else {
                        this.temporizador = 120;
                        window.localStorage.setItem('time', this.temporizador.toString());

                    }
                    this.startTimerLlamada();
                }


            },
            error => {
                console.error(error);
            }
        );
        // escucha cuando se termina el tiempo de seleccionar la opcion y es sin observacion
        this.toggleCallEventCortoSubscription = this.mainCallData.toggleCallEventCorto.subscribe(
            response => {
                if (response) {
                    //console.log("Se activa el timer Corto")

                    this.unsuscribeEvents();
                    let cn = window.localStorage.getItem("corto_time") || "none";
                    this.temporizadorCortoActive = true;


                    if (cn !== "none") {
                        this.corto_time = JSON.parse(cn);
                        this.temporizadorCorto = this.corto_time.max_value;
                        window.localStorage.setItem('c_time', this.temporizadorCorto.toString());

                    }
                    else {
                        this.temporizadorCorto = 30;
                        window.localStorage.setItem('c_time', this.temporizadorCorto.toString());

                    }
                    this.startTimerCorto();
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

                    this.unsuscribeEvents();

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
    unsuscribeEvents(): void {

        let cn = window.localStorage.getItem("conn_time") || "none";
        if (cn !== "none") {
            this.conn_time = JSON.parse(cn);
            this.temporizador = this.conn_time.max_value;
            window.localStorage.setItem('time', this.temporizador.toString());
        }
        else {
            this.temporizador = 120;
            window.localStorage.setItem('time', this.temporizador.toString());

        }

        let cortn = window.localStorage.getItem("corto_time") || "none";
        if (cortn !== "none") {
            this.corto_time = JSON.parse(cortn);
            this.temporizadorCorto = this.corto_time.max_value;
            window.localStorage.setItem('c_time', this.temporizadorCorto.toString());
        }
        else {
            this.temporizadorCorto = 30;
            window.localStorage.setItem('c_time', this.temporizadorCorto.toString());
        }

        let cnOpt = window.localStorage.getItem("option_time") || "none";

        if (cnOpt !== "none") {
            this.option_time = JSON.parse(cnOpt);
            this.optionTemporizador = this.option_time.max_value;
            window.localStorage.setItem('optionTime', this.optionTemporizador.toString());

        }
        else {
            this.optionTemporizador = 120;
            window.localStorage.setItem('optionTime', this.optionTemporizador.toString());

        }

        let cnI = window.localStorage.getItem("inactive_time") || "none";
        if (cn !== "none") {
            this.inactive_time = JSON.parse(cnI);
            this.temporizadorInactividad = this.inactive_time.max_value;
            window.localStorage.setItem('i_time', this.temporizadorInactividad.toString());

        }
        else {
            this.temporizadorInactividad = 360;
            window.localStorage.setItem('time', this.temporizadorInactividad.toString());

        }
        this.optionTemporizadorActive = false;
        this.temporizadorCortoActive = false;
        this.timerPrincipal = false;
        this.temporizadorInactividadActive = false;

        if (this.countDownCheck) {
            this.countDownCheck.unsubscribe();
        }
        if (this.countDownInactivity) {
            this.countDownInactivity.unsubscribe();
            this.temporizadorInactividadActive = false;

        }
        if (this.countDownOption) {
            this.countDownOption.unsubscribe();
            this.optionTemporizadorActive = false;

        }
        if (this.countDownCall) {
            this.countDownCall.unsubscribe();
            this.temporizadorActive = false;

        }
        if (this.countDownCorto) {
            this.countDownCorto.unsubscribe();
            this.temporizadorCortoActive = false;

        }

        if (this.countDown) {
            this.countDown.unsubscribe();
            this.timerPrincipal = false;
        }




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
                        //alert(response.message);
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
        this.unsuscribeEvents();
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
                this.mensajeEnviado = false;

                this.unsuscribeEvents();

                if (this.rolId != "1") {
                    this.timerPrincipal = true;
                    this.startTimerPrincipal();
                    this.startTimerCheck();
                    this.startTimerInactividad();
                }

                window.localStorage.setItem("callMethod", "NONE");

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

    startTimerPrincipal() {

        let autocall = window.localStorage.getItem("autocall_time") || "none";
        if (autocall !== "none") {
            this.autocall_time = JSON.parse(autocall);
            this.counter = this.autocall_time.min_value;

        }
        else {
            this.counter = 15;
        }

        this.countDown = timer(0, 1000).subscribe(() => {

            if (this.currentCustomer != null && !this.ready && !this.error && !this.timerActive && this.timerPrincipal) {
                if (this.counter === 0) {

                    this.counter = 100;
                    console.log("finalizó el timer principal")
                    this.ready = true;
                    this.timerPrincipal = false;
                    this.unsuscribeEvents();
                    this.startTimerCheck();
                    this.startTimerInactividad();
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

}
