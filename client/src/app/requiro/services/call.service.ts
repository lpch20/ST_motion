import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ResultWithData } from '../../../../../datatypes/result';
import { TokenService } from './token.service';

@Injectable()
export class CallService {
  private callURL: string = "/api/call";

  constructor(private http: HttpClient, private tokenService: TokenService) { }

  makeCall(idCustomer: number, sourcePhone: string, targetPhone: string): Observable<ResultWithData<any>> {
    return this.http.post<ResultWithData<any[]>>(this.callURL + "/makeCall", { idCustomer, source: sourcePhone, dest: targetPhone });
  }

  makeCallFromAgent(idCustomer: number, phone: string): Observable<ResultWithData<any>> {
    let agent = this.tokenService.getAgentToken();
    return this.http.post<ResultWithData<any[]>>(this.callURL + "/makeCall", { idCustomer, source: agent, dest: phone });
  }
}
