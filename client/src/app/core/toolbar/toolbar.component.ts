import { Component, Input } from '@angular/core';
import { MatSidenav } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'fury-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  public isHome: boolean;

  @Input('quickpanel') quickpanel: MatSidenav;

  constructor(router: Router, location: Location) {

    router.events.subscribe((val) => {
      this. isHome = location.path() == '/home';
    });

  }
}
