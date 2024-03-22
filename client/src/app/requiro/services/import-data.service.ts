import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ResultWithData } from '../../../../../datatypes/result';

@Injectable()
export class ImportDataService {

  readonly IMPORT_URL = '/api/importData';

  constructor(private http: HttpClient) { }

  importCustomerData(): Observable<ResultWithData<any[]>> {
    return this.http.post<ResultWithData<any[]>>(this.IMPORT_URL + '/customerData', null);
  }

  importAllCustomerData(): Observable<ResultWithData<any[]>> {
    return this.http.post<ResultWithData<any[]>>(this.IMPORT_URL + '/allCustomerData', null);
  }


  importCampaignsData(): Observable<ResultWithData<any[]>> {
    return this.http.post<ResultWithData<any[]>>(this.IMPORT_URL + '/importCampaignsData', null);
  }

  importDatesAssign(): Observable<ResultWithData<any[]>> {
    return this.http.post<ResultWithData<any[]>>(this.IMPORT_URL + '/importDatesAssign', null);
  }

  // importmoraTemprana(): Observable<ResultWithData<any[]>> {
  //   return this.http.get<ResultWithData<any[]>>(this.importURL + "/moraTemprana");
  // }

  importData(data: any): Observable<ResultWithData<any[]>> {
    return this.http.post<ResultWithData<any[]>>(this.IMPORT_URL + '/importData', { data });
  }

  importDebt(): Observable<ResultWithData<any[]>> {
    return this.http.post<ResultWithData<any[]>>(this.IMPORT_URL + '/importDeuda/', null);
  }

  importPayments(): Observable<ResultWithData<any[]>> {
    return this.http.post<ResultWithData<any[]>>(this.IMPORT_URL + '/importPayments', null);
  }

  importAgreements(): Observable<ResultWithData<any[]>> {
    return this.http.post<ResultWithData<any[]>>(this.IMPORT_URL + '/importAgreements', null);
  }

  changeCampaign(file: File) {

    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(this.IMPORT_URL + '/changeCampaign', formData);

  }

  changeQueue(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(this.IMPORT_URL + '/changeQueue', formData);
  }


  changeCampaignAndQueue(file: File) {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.post<any>(this.IMPORT_URL + '/changeCampaignAndQueue', formData);
  }


}
