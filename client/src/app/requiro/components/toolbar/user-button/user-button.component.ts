import { AuthenticateService } from '../../../services/authenticate.service';
import { Router } from '@angular/router';
import { OnInit, Component } from '@angular/core';
import { UsersService } from '../../../services/users.service';
import { User } from '../../../../../../../datatypes/user';
import { TokenService } from '../../../services/token.service';


@Component({
  selector: 'user-button',
  templateUrl: './user-button.component.html',
  styleUrls: ['./user-button.component.scss']
})
export class UserButtonComponent implements OnInit {

  isOpen: boolean;
  currentUser: User;

  constructor(private router: Router,
    private userService: UsersService,
    private authenticateService: AuthenticateService,
    private tokenService: TokenService) {
    this.currentUser = <User>{};
    this.currentUser.firstname = 'Mi ';
    this.currentUser.lastname = 'usuario';
  }

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(
      response => {
        this.currentUser = response.data;
      }
    );
  }

  logout(): void {
    this.authenticateService.closeSession().subscribe(
      response => {
        this.tokenService.removeToken();
        if (response.result > 0) {
          this.router.navigate(['login']);
        }
      }
    );
  }

  profile(): void {
    this.router.navigate(['profile']);
  }

  toggleDropdown() {
    this.isOpen = !this.isOpen;
  }

  onClickOutside() {
    this.isOpen = false;
  }
}
