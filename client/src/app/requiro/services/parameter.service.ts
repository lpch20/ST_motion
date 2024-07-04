import { Injectable } from '@angular/core';
import { ResultWithData } from '../../../../../datatypes/result';
import { Observable } from 'rxjs/Observable';
import { ParameterType } from '../../../../../datatypes/ParameterType';
import { CallHistory } from '../../../../../datatypes/CallHistory';
import { HttpClient } from '@angular/common/http';
import { CacheService } from './cache-service';

@Injectable()
export class ParameterService {
  private parameterURL = '/api/parameters';


  constructor(private http: HttpClient,
    private cacheService: CacheService) { }


  public getParameters(): Observable<ResultWithData<ParameterType[]>> {
    return this.http.get<ResultWithData<ParameterType[]>>(this.parameterURL + '/getParameters');
   }

  public getLastCall(customerId: string): Observable<ResultWithData<CallHistory[]>> {
    return this.http.post<ResultWithData<CallHistory[]>>(this.parameterURL + '/lastCall',{ customerId});
   }


}
