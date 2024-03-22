import { Injectable } from '@angular/core';
import { HttpClient } from '../../../../node_modules/@angular/common/http';
import { Observable } from '../../../../node_modules/rxjs';
import { ResultWithData } from '../../../../../datatypes/result';

@Injectable()
export class BranchOfficeService {

  private branchOfficeURL: string = '/api/branchOffice';

  constructor(private http: HttpClient) { }

  getAll(): Observable<ResultWithData<any>> {
    return this.http.get<ResultWithData<any>>(this.branchOfficeURL);
  }


}
