
import { Injectable } from '@angular/core';
import { ResultWithData } from '../../../../../datatypes/result';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { Observable } from '../../../../node_modules/rxjs';

@Injectable()
export class ActionService {

  private actionURL: string = '/api/action';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ResultWithData<any>> {
    return this.http.get<ResultWithData<any>>(this.actionURL);
  }


}
