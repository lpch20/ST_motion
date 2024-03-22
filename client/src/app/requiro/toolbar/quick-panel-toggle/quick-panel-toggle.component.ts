import { Component, OnInit, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'quick-panel-toggle',
  templateUrl: './quick-panel-toggle.component.html',
  styleUrls: ['./quick-panel-toggle.component.scss']
})
export class QuickPanelToggleComponent implements OnInit {

  @Input() quickpanel: MatSidenav;

  constructor() {
  }

  openQuickpanel() {
    this.quickpanel.open();
  }

  ngOnInit() {
  }

}