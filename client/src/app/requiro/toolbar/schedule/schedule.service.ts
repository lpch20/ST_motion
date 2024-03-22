import { Injectable } from '@angular/core';
import { ResultWithData } from '../../../../../../datatypes/result';
import { Observable } from 'rxjs/Observable';
import { HttpClient } from '@angular/common/http';
import { VSchedule } from '../../../../../../datatypes/viewDataType/VSchedule';

@Injectable()
export class ScheduleService {
  private scheduleURL: string = '/api/schedule';

  constructor(private http: HttpClient) { }

  public get(): Observable<ResultWithData<any>> {
    return this.http.get<ResultWithData<VSchedule>>(this.scheduleURL);
  }

  public updateScheduleResolve(id,resolved:boolean): Observable<ResultWithData<any>> {
    return this.http.put<ResultWithData<VSchedule>>(this.scheduleURL + "/updateScheduleResolve",{id,resolved});
  }

  public getScheduleDayByUser(): Observable<ResultWithData<any>> {
    return this.http.get<ResultWithData<VSchedule>>(this.scheduleURL + "/getScheduleDayByUser");
  }

  public getByDate(userId:number, dateFrom:Date,dateTo:Date): Observable<ResultWithData<any>> {
    return this.http.post<ResultWithData<VSchedule>>(this.scheduleURL + "/getByDate",{userId, dateFrom,dateTo});
  }
  public getByCurrentUserByDate(dateFrom:Date,dateTo:Date): Observable<ResultWithData<any>> {
    return this.http.post<ResultWithData<VSchedule>>(this.scheduleURL + "/getByCurrentUserByDate",{dateFrom,dateTo});
  }

  public addSchedule(schedule:VSchedule): Observable<ResultWithData<any>> {
    return this.http.post<ResultWithData<VSchedule>>(this.scheduleURL,{schedule});
  }
}