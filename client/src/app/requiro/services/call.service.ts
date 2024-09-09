import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ResultWithData } from '../../../../../datatypes/result';
import { TokenService } from './token.service';

@Injectable()
export class CallService {
  private callURL: string = "/api/call";

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  makeCall(idCustomer: number, sourcePhone: string, targetPhone: string): Observable<ResultWithData<any>> {
    return this.http.post<ResultWithData<any[]>>(this.callURL + "/makeCall", { idCustomer, source: sourcePhone, dest: targetPhone, agent: "none" });
  }

  makeCallFromAgent(idCustomer: number, phone: string, ci: string, port: string): Observable<ResultWithData<any>> {
    let agent = this.tokenService.getAgentToken();
    let user = localStorage.getItem('user') || "none"
    if (agent == null)
      agent = user;
    return this.http.post<ResultWithData<any[]>>(this.callURL + "/makeCall", { idCustomer, source: agent, dest: phone, agent: agent, identification: ci, portfolio: port });
  }
}
