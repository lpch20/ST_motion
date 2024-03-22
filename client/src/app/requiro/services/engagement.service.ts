import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ResultWithData } from '../../../../../datatypes/result';
import { Engagement } from '../../../../../datatypes/viewDataType/engagement';
import { CacheService } from './cache-service';

@Injectable()
export class EngagementService {
  private engagementURL = '/api/engagement';

  readonly MAX_AGE = 5000;

  constructor(private http: HttpClient,
    private cacheService: CacheService) { }

  add(engagement: Engagement): Observable<ResultWithData<any>> {
    return this.http.post<ResultWithData<any>>(this.engagementURL, { engagement });
  }

  getEngagementsByDate(userId: number, dateFrom: Date, dateTo: Date): Observable<ResultWithData<any>> {
    const URL = this.engagementURL + '/getEngagementsByDate';
    const VALUES = { userId, dateFrom, dateTo };
    const KEY = URL + JSON.stringify(VALUES);
    return this.cacheService.get(KEY, this.http.post<ResultWithData<any>>(URL, VALUES), this.MAX_AGE);
  }

  getEngagementsByCurrentUserByDate(dateFrom: Date, dateTo: Date): Observable<ResultWithData<any>> {
    const URL = this.engagementURL + '/getEngagementsByCurrentUserByDate';
    const VALUES = { dateFrom, dateTo };
    const KEY = URL + JSON.stringify(VALUES);
    return this.cacheService.get(KEY, this.http.post<ResultWithData<any>>(URL, VALUES), this.MAX_AGE);
  }

  getEngagementsByCustomer(idCustomer: number): Observable<ResultWithData<any>> {
    return this.http.get<ResultWithData<any>>(this.engagementURL + '/getEngagementsByCustomer/' + idCustomer);
  }
}
