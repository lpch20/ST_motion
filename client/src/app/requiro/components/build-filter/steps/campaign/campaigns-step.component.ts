import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { StepComponentBase } from '../stepComponent';
import { CampaignService } from '../../../../services/campaign.service';
import { ResultCode } from '../../../../../../../../datatypes/result';
import { ICampaign } from '../../../../../../../../datatypes/Campaign';

@Component({
  selector: 'campaigns-step',
  templateUrl: './campaigns-step.component.html',
  styleUrls: ['./campaigns-step.component.scss']
})
export class CampaignsStepComponent extends StepComponentBase implements OnInit {

  campaigns: CampaignStep[];
  formGroup: FormGroup;

  constructor(private campaignsService: CampaignService) {
    super();
  }

  ngOnInit() {
    this.campaignsService.getAllActive().subscribe(
      res => {
        if (res.result == ResultCode.Error) {
          // handle error
        } else {
          this.campaigns = res.data.map(c => { return { enabled: false, campaign: c }; });
        }
      },
      err => {
        // handle error
      }
    );
  }
  
  getValues(): any[] {
    return this.campaigns.filter(c => c.enabled).map(c => c.campaign.id);
  }

  checkChange(campaign: CampaignStep): void {
    campaign.enabled = !campaign.enabled;
    this.step.completed = this.campaigns.some(c => c.enabled);

    this.applyFilter();
  }
}

class CampaignStep {
  enabled: boolean;
  campaign: ICampaign;
}
