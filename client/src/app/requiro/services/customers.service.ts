import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AgreementData } from '../../../../../datatypes/AgreementData';
import { ClientEvent } from '../../../../../datatypes/clientEvent';
import { Customer, ICustomer } from '../../../../../datatypes/Customer';
import { CustomerCampaign } from '../../../../../datatypes/CustomerCampaign';
import { DebtData } from '../../../../../datatypes/DebtData';
import { PaymentData } from '../../../../../datatypes/PaymentData';
import { ResultWithData } from '../../../../../datatypes/result';

@Injectable()
export class CustomersService {
    private customerURL = '/api/customers';

    constructor(private http: HttpClient) { }

    public getAll(): Observable<ResultWithData<ICustomer[]>> {
        return this.http.get<ResultWithData<ICustomer[]>>(this.customerURL);
    }

    public find(name: string, lastname: string, ci: string, phone: string): Observable<ResultWithData<Customer[]>> {
        return this.http.post<ResultWithData<Customer[]>>(this.customerURL + '/find', { name, lastname, ci, phone });
    }

    public updateCustomer(customer: Customer): Observable<ResultWithData<Customer>> {
        return this.http.put<ResultWithData<Customer>>(this.customerURL, { customer });
    }

    public getNextCustomers(): Observable<ResultWithData<Customer[]>> {
        return this.http.get<ResultWithData<Customer[]>>(this.customerURL + '/next');
    }

    public getDeactiveCustomers(): Observable<ResultWithData<Customer[]>> {
        return this.http.get<ResultWithData<Customer[]>>(this.customerURL + '/getDeactiveCustomers');
    }

    public getCustomersNotAssignedQueue(): Observable<ResultWithData<Customer[]>> {
        return this.http.get<ResultWithData<Customer[]>>(this.customerURL + '/getCustomersNotAssignedQueue');
    }

    public getCustomersById(id: number): Observable<ResultWithData<Customer>> {
        return this.http.get<ResultWithData<Customer>>(this.customerURL + '/' + id);
    }

    public getPhonesByCustomersById(id: number): Observable<ResultWithData<any>> {
        return this.http.get<ResultWithData<any>>(this.customerURL + '/getPhonesByCustomersById/' + id);
    }

    public getCustomerForSMS(): Observable<ResultWithData<any>> {
        return this.http.get<ResultWithData<any>>(this.customerURL + '/getCustomerForSMS/');
    }

    public getCustomerDebtById(id: number): Observable<ResultWithData<DebtData[]>> {
        return this.http.get<ResultWithData<DebtData[]>>(this.customerURL + '/customerDebt/' + id);
    }

    public getCustomerPaymentsById(id: number): Observable<ResultWithData<PaymentData[]>> {
        return this.http.get<ResultWithData<PaymentData[]>>(this.customerURL + '/customerPayments/' + id);
    }

    public getCustomerAgreementById(id: number): Observable<ResultWithData<AgreementData[]>> {
        return this.http.get<ResultWithData<AgreementData[]>>(this.customerURL + '/customerAgreement/' + id);
    }

    public getCustomersCampaign(idCustomers: number[]): Observable<ResultWithData<CustomerCampaign[]>> {
        return this.http.post<ResultWithData<CustomerCampaign[]>>(this.customerURL + '/customersCampaign', idCustomers);
    }

    public addCustomerEvent(customerEvent: { idCampaign: number, event: ClientEvent, flag: boolean }): Observable<ResultWithData<Customer>> {
        return this.http.post<ResultWithData<Customer>>(this.customerURL + '/addEvent', { customerEvent });
    }

    public updateItemQueueStatus(idCustomer: number, status: string): Observable<ResultWithData<Customer>> {
        return this.http.put<ResultWithData<Customer>>(this.customerURL + '/updateItemQueueStatus', { idCustomer, status });
    }

    public setItemQueueFinish(idCustomer: number): Observable<ResultWithData<Customer>> {
        return this.http.post<ResultWithData<Customer>>(this.customerURL + '/setItemQueueFinish', { idCustomer });
    }
}
