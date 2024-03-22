import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ResultWithData } from '../../../../../datatypes/result';

@Injectable()
export class MenuService {

  readonly MENU_URL: string = "/api/menu";

  constructor(private http: HttpClient) { }

  menuByRol(): Observable<ResultWithData<any[]>> {
    return this.http.get<ResultWithData<any[]>>(this.MENU_URL);
  }
}
