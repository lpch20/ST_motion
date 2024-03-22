import { Injectable } from '@angular/core';
import { Campaign, ICampaign } from '../../../../../datatypes/Campaign';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { ResultWithData } from '../../../../../datatypes/result';
import { CacheService } from './cache-service';

@Injectable()
export class CampaignService {

  private campaignURL = '/api/campaigns';

  readonly BUSINESS_DATA_MAX_AGE = 5000;
  readonly LOOKUP_DATA_MAX_AGE = 60000;

  constructor(private http: HttpClient,
    private cacheService: CacheService) { }

  getAllActive(): Observable<ResultWithData<ICampaign[]>> {
    const URL = this.campaignURL + '/getActive';
    const KEY = URL;
    return this.cacheService.get(KEY, this.http.get<ResultWithData<ICampaign[]>>(URL), this.LOOKUP_DATA_MAX_AGE);
  }

  getAll(): Observable<ResultWithData<ICampaign[]>> {
    const URL = this.campaignURL;
    const KEY = URL;
    return this.cacheService.get(KEY, this.http.get<ResultWithData<ICampaign[]>>(URL), this.LOOKUP_DATA_MAX_AGE);
  }

  activateDeactivate(idCampaign: number, active: boolean): Observable<ResultWithData<ICampaign[]>> {
    return this.http.put<ResultWithData<ICampaign[]>>(this.campaignURL + '/activateDeactivate', { idCampaign, active });
  }
}
