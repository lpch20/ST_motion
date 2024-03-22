import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'quick-panel',
  templateUrl: './quick-panel.component.html',
  styleUrls: ['./quick-panel.component.scss']
})
export class QuickPanelComponent implements OnInit {

  @Input() quickpanel: MatSidenav;

  todayDay: any;
  todayDate: any;
  todayMonth: any;
  todayDateSuffix: any;

  constructor() {
  }

  openQuickpanel() {
    this.quickpanel.open();
  }

  ngOnInit() {
  }
}
