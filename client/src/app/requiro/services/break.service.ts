import { Injectable } from '@angular/core';
import { ResultWithData } from '../../../../../datatypes/result';
import { Observable } from 'rxjs/Observable';
import { BreakType } from '../../../../../datatypes/BreakType';
import { Break, IBreak } from '../../../../../datatypes/Break';
import { HttpClient } from '@angular/common/http';
import { CacheService } from './cache-service';

@Injectable()
export class BreakService {
  private breakTypeURL = '/api/BreakType';
  private breaksURL = '/api/Breaks';

  readonly BUSINESS_DATA_MAX_AGE = 5000;
  readonly LOOKUP_DATA_MAX_AGE = 60000;

  constructor(private http: HttpClient,
    private cacheService: CacheService) { }

  public addBreak(breakTime: Break): Observable<ResultWithData<any>> {
    return this.http.post<ResultWithData<Break>>(this.breaksURL, { breakTime });
  }

  public getBreakTypes(): Observable<ResultWithData<BreakType[]>> {
    const URL = this.breakTypeURL;
    const KEY = URL;
    return this.cacheService.get(KEY, this.http.get<ResultWithData<BreakType[]>>(URL), this.LOOKUP_DATA_MAX_AGE);
  }

  // todo : esto no deberia de devolver array. deberia de devolver uno solo desde el backend
  public getLastBreakByCurrentUser(): Observable<any> {
    return this.http.get<ResultWithData<IBreak[]>>(this.breaksURL + '/getLastByCurrentUser');
  }

  public getBreaksByCurrentUser(): Observable<ResultWithData<IBreak[]>> {
    return this.http.get<ResultWithData<IBreak[]>>(this.breaksURL + '/getByCurrentUser');
  }

  public getBreakByDate(userId: number, dateFrom: Date, dateTo: Date): Observable<ResultWithData<IBreak[]>> {
    const URL = this.breaksURL + '/getBreakByDate';
    const VALUES = { userId, dateFrom, dateTo };
    const KEY = URL + JSON.stringify(VALUES);
    return this.cacheService.get(KEY, this.http.post<ResultWithData<IBreak[]>>(URL, VALUES), this.BUSINESS_DATA_MAX_AGE);
  }

  public getBreakByCurrentUserByDate(dateFrom: Date, dateTo: Date): Observable<ResultWithData<IBreak[]>> {
    const URL = this.breaksURL + '/getBreakByCurrentUserByDate';
    const VALUES = { dateFrom, dateTo };
    const KEY = URL + JSON.stringify(VALUES);
    return this.cacheService.get(KEY, this.http.post<ResultWithData<IBreak[]>>(URL, VALUES), this.BUSINESS_DATA_MAX_AGE);
  }

  public getLastBreaks(): Observable<ResultWithData<IBreak[]>> {
    return this.http.get<ResultWithData<IBreak[]>>(this.breaksURL + '/getLastBreaks');
  }
}
