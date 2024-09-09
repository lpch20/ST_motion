import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { CallHistory } from '../../../../../datatypes/CallHistory';
import { ParameterType } from '../../../../../datatypes/ParameterType';
import { ResultWithData } from '../../../../../datatypes/result';
import { CacheService } from './cache-service';

@Injectable()
export class ParameterService {
  private parameterURL = '/api/parameters';


  constructor(private http: HttpClient,
    private cacheService: CacheService) { }


  public getParameters(): Observable<ResultWithData<ParameterType[]>> {
    return this.http.get<ResultWithData<ParameterType[]>>(this.parameterURL + '/getParameters');
  }

  public getLastCall(customerId: string, phone: string, time: number): Observable<ResultWithData<CallHistory[]>> {
    return this.http.post<ResultWithData<CallHistory[]>>(this.parameterURL + '/lastCall', { customerId, phone, time });
  }


}
