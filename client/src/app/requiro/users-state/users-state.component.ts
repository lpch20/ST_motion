import { Component } from '@angular/core';
import { Router, NavigationStart, Event } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'fury-users-state',
  templateUrl: './users-state.component.html',
  styleUrls: ['./users-state.component.scss']
})
export class UsersStateComponent {

  timerActive = true;

  constructor(router: Router, location: Location) {
    router.events.subscribe((event: Event) => {
      if (event instanceof NavigationStart) {
        if (location.path() === '/estado-usuarios') {
          this.timerActive = false;
        } else {
          this.timerActive = true;
        }
      }
    });
  }
}
