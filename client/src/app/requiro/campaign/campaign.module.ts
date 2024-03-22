import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CampaignRoutingModule } from './campaign-routing.module';
import { CampaignComponent } from './campaign.component';
import { BreakCallComponent } from '../components/break-call/break-call.component';
import { MaterialModule } from '../../core/common/material-components.module';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    CampaignRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [CampaignComponent]
})
export class CampaignModule {
}
