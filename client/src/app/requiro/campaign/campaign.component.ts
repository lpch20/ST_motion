import { Component, OnInit } from '@angular/core';
import { CampaignService } from '../services/campaign.service';
import { Campaign } from '../../../../../datatypes/Campaign';

@Component({
  selector: 'fury-campaign',
  templateUrl: './campaign.component.html',
  styleUrls: ['./campaign.component.scss']
})
export class CampaignComponent implements OnInit {

  campaigns:Campaign[];
  constructor(private campaignService:CampaignService) { }

  ngOnInit() {
    this.loadCampaigns();
  }

  loadCampaigns():void{
    this.campaignService.getAll().subscribe(
      response => {
        if(response.result > 0){
          this.campaigns = response.data;
        }
      }
    )
  }

  updateCampaign(campaign:Campaign):void{
    this.campaignService.activateDeactivate(campaign.id,campaign.active).subscribe(
      response =>{
        this.loadCampaigns();
      }
    )
  }

}
