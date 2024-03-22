import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'app/core/common/material-components.module';
import { FormsModule } from '@angular/forms';
// import { FuryCardModule } from 'app/core/common/card/card.module';
import { ScrollbarModule } from 'app/core/common/scrollbar/scrollbar.module';

import { SmsSenderComponent } from './sms-sender.component';
import { SmsSenderRoutingModule } from './sms-sender-routing.module';

@NgModule({
  imports: [
    CommonModule,
    SmsSenderRoutingModule,
    MaterialModule,
    FormsModule,
    ScrollbarModule
  ],
  declarations: [SmsSenderComponent]
})
export class SmsSenderModule { }
