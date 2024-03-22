import { Component, OnInit } from '@angular/core';
import { AuthenticateService } from '../../../requiro/services/authenticate.service';
import { Router } from '@angular/router';

@Component({
  selector: 'fury-toolbar-user-button',
  templateUrl: './toolbar-user-button.component.html',
  styleUrls: ['./toolbar-user-button.component.scss']
})
export class ToolbarUserButtonComponent {

  isOpen: boolean;

  constructor(
    private router: Router,
    private authenticateService: AuthenticateService) { }

  logout(): void {
    this.authenticateService.closeSession().subscribe(
      response => {
        if (response.result > 0) {
          this.router.navigate(['login']);
        }
      }
    );
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }
}
