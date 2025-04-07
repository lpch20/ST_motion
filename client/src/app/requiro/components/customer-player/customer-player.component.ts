import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChange, SimpleChanges } from '@angular/core';
import { MainCallDataServiceService } from 'app/requiro/services/main-call-data-service.service';
import { Campaign } from '../../../../../../datatypes/Campaign';
import { Customer } from '../../../../../../datatypes/Customer';
import { Redirect } from '../../../../../../datatypes/eventType';
import { ResultCode } from '../../../../../../datatypes/result';
import { CampaignService } from '../../services/campaign.service';
import { CustomersService } from '../../services/customers.service';

@Component({
  selector: 'customer-player',
  templateUrl: './customer-player.component.html',
  styleUrls: ['./customer-player.component.scss']
})
export class CustomerPlayerComponent implements OnInit, OnChanges {

  @Input() customer: Customer;
  indexPhone: number = 0;
  @Input() playerStatus: boolean;
  @Input() timerActive: boolean;
  @Input() contador: number;
  @Input() rolId: string;
  @Output() detailEvent = new EventEmitter<boolean>();
  @Output() callPhone = new EventEmitter<boolean>();
  public _showDetail: boolean = false;
  campaigns: Campaign[];

  constructor(private mainCallService: MainCallDataServiceService,
    private campaignService: CampaignService,
    private mainCallData: MainCallDataServiceService,
    private customerService: CustomersService) { }

  showDetail(): void {

    console.log("el rol id es : " + this.rolId)
    this._showDetail = !this._showDetail;
    this.detailEvent.emit(this._showDetail);
  }

  @Input('index-current-phone')
  set indexCurrentPhone(index: number) {
    if (index) {
      this.indexPhone = index;
      console.log("Indice en customer Player", this.indexPhone, index);
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    const name: SimpleChange = changes.indexCurrentPhone;
    if (name) {
      console.log('prev value index phone player: ', name.previousValue);
      console.log('current value index phone player: ', name.currentValue);
      this.indexPhone = name.currentValue;
    }
  }


  call(): void {
    this.callPhone.emit(true);
  }

  toogle(): void {
    this.mainCallService.sendPlayerEvent(!this.playerStatus);
  }

  public getCampaignById(idCampaign: number): Campaign {
    return this.campaigns.filter(f => f.id === idCampaign)[0];
  }

  ngOnInit() {
    console.log(this.indexPhone, "INDEX PHONE");
    this.campaignService.getAll().subscribe(res => {
      if (res.result === ResultCode.OK) {
        this.campaigns = res.data;
      } else {
        console.error(res);
      }
    });
  }

  nextCustomer(): void {
    this.mainCallData.sendToggleAddObervacionEvent(true);
    this.customerService.updateItemQueueStatus(this.customer.id, "skipped").subscribe(
      response => {
        this.mainCallService.sendNewCustomerEvent(true, Redirect.OtherCustomer);
      },
      err => {
        console.error(err);
      }
    );
  }
}
