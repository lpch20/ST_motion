import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ResultWithData, Result } from '../../../../../datatypes/result';
import { FilterResult } from '../../../../../datatypes/filter/filterResult';
import { FilterStep } from '../../../../../datatypes/filter/filter-step';
import { Filters } from '../../../../../datatypes/filter/filters';
import { Step } from '../components/build-filter/steps/step';
import { FilterProgress } from '../../../../../datatypes/filter/filter-progress';

@Injectable()
export class FiltersService {
  private filtersURL: string = '/api/filters';

  constructor(private http: HttpClient) { }

  getFilters(): Observable<ResultWithData<Filters[]>> {
    return this.http.get<ResultWithData<Filters[]>>(this.filtersURL);
  }
  getFilterProgress(group: number): Observable<ResultWithData<FilterProgress[]>> {
    return this.http.get<ResultWithData<FilterProgress[]>>(this.filtersURL + '/groups/' + group);
  }

  getCountByUsers(users: number[]): Observable<ResultWithData<number>> {
    return this.http.post<ResultWithData<number>>(this.filtersURL + '/customers', { users }, { params: { onlyCount: 'true' } });
  }

  filter(currStep: Step, previousSteps: Step[], users: number[]): Observable<ResultWithData<FilterResult>> {
    return this.http.post<ResultWithData<FilterResult>>(this.filtersURL, { currStep, previousSteps, users });
  }

  processFilter(filters: FilterStep[], users: number[], reiniciar: boolean): Observable<Result> {
    return this.http.post<Result>(this.filtersURL + "/apply", { filters, users, reiniciar });
  }
}