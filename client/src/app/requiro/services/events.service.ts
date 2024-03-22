import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResultWithData } from '../../../../../datatypes/result';
import { CacheService } from './cache-service';

@Injectable()
export class EventsService {
  private eventsURL = '/api/events';

  readonly MAX_AGE = 5000;

  constructor(
    private http: HttpClient,
    private cacheService: CacheService
  ) { }

  getEventByCurrentUser(): Observable<ResultWithData<any[]>> {
    return this.http.get<ResultWithData<any[]>>(this.eventsURL + '/getEventByCurrentUser');
  }

  getEventByCustomer(idCustomer: number): Observable<ResultWithData<any[]>> {
    return this.http.get<ResultWithData<any[]>>(this.eventsURL + '/getEventsByCustomer/' + idCustomer);
  }

  getEventByDate(userId: number, dateFrom: Date, dateTo: Date): Observable<ResultWithData<any[]>> {
    const URL = this.eventsURL + '/getEventByDate';
    const VALUES = { userId, dateFrom, dateTo };
    const KEY = URL + JSON.stringify(VALUES);
    return this.cacheService.get(KEY, this.http.post<ResultWithData<any>>(URL, VALUES), this.MAX_AGE);
  }

  getEventByCurrentUserByDate(dateFrom: Date, dateTo: Date): Observable<ResultWithData<any[]>> {
    const URL = this.eventsURL + '/getEventByCurrentUserByDate';
    const VALUES = { dateFrom, dateTo };
    const KEY = URL + JSON.stringify(VALUES);
    return this.cacheService.get(KEY, this.http.post<ResultWithData<any>>(URL, VALUES), this.MAX_AGE);
  }

  getEventCountTypeByUser(userId: number, dateFrom: Date, dateTo: Date): Observable<ResultWithData<any[]>> {
    return this.http.post<ResultWithData<any[]>>(this.eventsURL + '/getEventCountTypeByUser', { userId, dateFrom, dateTo });
  }
}
