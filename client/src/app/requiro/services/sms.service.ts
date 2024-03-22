import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Result } from '../../../../../datatypes/result';

@Injectable()
export class SmsService {
  private smsURL: string = '/api/sms';

  constructor(private http: HttpClient) { }

  sendSMS(phone: string): Observable<Result> {
    return this.http.post<Result>(this.smsURL + '/send', { phone });
  }
}
