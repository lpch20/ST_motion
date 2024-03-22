import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ResultWithData } from '../../../../../datatypes/result';
import { Customer, ICustomer } from '../../../../../datatypes/Customer';



export class MainService {
  private customerURL: string = '/api/customers';

  constructor(private http: HttpClient) { }

  get(): Observable<ResultWithData<ICustomer[]>> {
    return this.http.get<ResultWithData<ICustomer[]>>(this.customerURL);
  }

  post(parameters: any[], url: string, ci: string, phone: string): Observable<ResultWithData<Customer[]>> {
    return this.http.post<ResultWithData<Customer[]>>(url, parameters);
  }

}
