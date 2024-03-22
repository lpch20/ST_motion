
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ResultWithData } from '../../../../../datatypes/result';

@Injectable()
export class DepartamentsService {
  private engagementURL: string = '/api/departaments';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ResultWithData<any>> {
    return this.http.get<ResultWithData<any>>(this.engagementURL);
  }

  getAllCities(): Observable<ResultWithData<any>> {
    return this.http.get<ResultWithData<any>>(this.engagementURL + "/cities");
  }
}