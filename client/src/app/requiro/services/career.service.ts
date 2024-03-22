import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ResultWithData } from '../../../../../datatypes/result';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class CareerService {
  // TODO: cambiar URL a /api/career
  private customerURL = '/api/customers';

  constructor(private http: HttpClient) { }

  getCareers(): Observable<ResultWithData<{ id: number, name: string }[]>> {
    return this.http.get<ResultWithData<{ id: number, name: string }[]>>(this.customerURL + '/getCareers');
  }
}
