import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Customer } from '../../../../../datatypes/Customer';
import { ResultWithData } from '../../../../../datatypes/result';


@Injectable()
export class QueueService {
  private queueURL: string = '/api/queue';
  constructor(private http: HttpClient) { }

  getAll(): Observable<ResultWithData<any>> {
    return this.http.get<ResultWithData<any>>(this.queueURL);
  }

  assignCustomersQueue(idQueue: number, customers: Customer[]): Observable<ResultWithData<any>> {
    return this.http.post<ResultWithData<any>>(this.queueURL, { idQueue, customers });
  }

  getCustomersByQueue(idQueue: number, idCampaign: number, ci: string): Observable<ResultWithData<any>> {
    return this.http.get<ResultWithData<any>>(this.queueURL + '/getCustomersByQueue/' + idQueue + '/' + ci + '/' + idCampaign);
  }

  updateCustomersQueue(idOldQueue: number, idNewQueue: number, customers: Customer[]): Observable<ResultWithData<any>> {
    return this.http.put<ResultWithData<any>>(this.queueURL + '/updateCustomersQueue/', { idOldQueue, idNewQueue, customers });
  }

  getusersbyqueue(idQueue: number): Observable<ResultWithData<{ id: number, firstname: string, lastname: string }[]>> {
    return this.http.get<ResultWithData<{ id: number, firstname: string, lastname: string }[]>>
      (`${this.queueURL}/getusersbyqueue/${idQueue}`);
  }

  getCampaignsByQueue(idQueue: number): Observable<ResultWithData<{ id: number, name: string }[]>> {
    return this.http.get<ResultWithData<{ id: number, name: string }[]>>
      (`${this.queueURL}/getcampaignsbyqueue/${idQueue}`);
  }

  assignCustomerFromCampaignToQueue(idQueue: number, idCampaign: number): Observable<ResultWithData<{ id: number, name: string }[]>> {
    return this.http.put<ResultWithData<{ id: number, name: string }[]>>
      (`${this.queueURL}/assignCustomerFromCampaignToQueue/`, { idQueue, idCampaign });
  }

  assignUserToQueue(idQueue: number, idUser: number): Observable<ResultWithData<{ id: number, name: string }[]>> {
    return this.http.put<ResultWithData<{ id: number, name: string }[]>>
      (`${this.queueURL}/assignUserToQueue/`, { idQueue, idUser });
  }

}
