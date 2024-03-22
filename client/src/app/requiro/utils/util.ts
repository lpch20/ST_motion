import { Router } from '@angular/router';
import { UsersService } from '../services/users.service';
import { Role } from '../../../../../datatypes/enums';

export class Util {

  constructor(private router: Router, private usersService: UsersService) { }

  public redirectByRole(rolId: number) {

    if (this.usersService.isRol(rolId, Role.Admin)) {
      this.router.navigate(['usuarios']);
    }
    else if (this.usersService.isRol(rolId, Role.Supervisor)) {
      this.router.navigate(['reportes-supervisor']);
    }
    else {
      // Retrieve          
      this.router.navigate(['home']);
    }
  }
}