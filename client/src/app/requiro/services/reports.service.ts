import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { Report } from '../../../../../datatypes/report';
import { ReportCall } from '../../../../../datatypes/reports/call';
import { ResultWithData } from '../../../../../datatypes/result';

@Injectable()
export class ReportsService {
  private reportsURL = '/api/reports';

  constructor(private http: HttpClient) { }

  customerByCampaign(idUser: number): Observable<ResultWithData<Report<number>[]>> {
    return this.http.post<ResultWithData<Report<number>[]>>(this.reportsURL + '/customerByCampaigns', { idUser });
  }

  callsByAgent(campaignId: number, from: Date, to: Date): Observable<ResultWithData<ReportCall[]>> {
    return this.http.post<ResultWithData<ReportCall[]>>(this.reportsURL + '/callsByAgent', { campaignId, from, to });
  }

  lastEventForAll(): Observable<ResultWithData<any[]>> {
    return this.http.get<ResultWithData<any[]>>(this.reportsURL + '/lastEventForAll');
  }

  deleteOldCustomerCampaigns(): Observable<ResultWithData<any[]>> {
    return this.http.get<ResultWithData<any[]>>(this.reportsURL + '/deleteOldCustomerCampaigns');
  }

}
