import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticateService } from '../services/authenticate.service';
import { UsersService } from '../services/users.service';
import { Role } from '../../../../../datatypes/enums';

@Injectable()
export class AuthRequiredService implements CanActivate {
    constructor(private authService: AuthenticateService,
        private router: Router) { }

    canActivate(): boolean {
        let isAuth = this.authService.isAuthenticated();

        if (!isAuth) {
            this.router.navigate(['login']);
        }
        return isAuth;
    }
}

@Injectable()
export class AgentRoleRequiredService implements CanActivate {
    constructor(private authService: AuthenticateService,
        private usersService: UsersService,
        private router: Router
    ) { }

    canActivate(): boolean {
        let isAuth = this.authService.isAuthenticated() &&
            this.usersService.isCurrentUserRole(Role.Agent);
        if (!isAuth) {
            this.router.navigate(['login']);
        }
        return isAuth;
    }
}
@Injectable()
export class SupervisorRoleRequiredService implements CanActivate {
    constructor(private authService: AuthenticateService,
        private usersService: UsersService,
        private router: Router) { }

    canActivate(): boolean {
        let isAuth = this.authService.isAuthenticated() &&
            this.usersService.isCurrentUserRole(Role.Supervisor);
        if (!isAuth) {
            this.router.navigate(['login']);
        }
        return isAuth;
    }
}
@Injectable()
export class SupervisorOrAdminRoleRequiredService implements CanActivate {
    constructor(private authService: AuthenticateService,
        private usersService: UsersService,
        private router: Router) { }

    canActivate(): boolean {
        let isAuth = this.authService.isAuthenticated() &&
            (this.usersService.isCurrentUserRole(Role.Supervisor) || this.usersService.isCurrentUserRole(Role.Admin));
        if (!isAuth) {
            this.router.navigate(['login']);
        }
        return isAuth;
    }
}
@Injectable()
export class AdminRoleRequiredService implements CanActivate {

    constructor(private authService: AuthenticateService,
        private usersService: UsersService,
        private router: Router) { }

    canActivate(): boolean {
        let isAuth = this.authService.isAuthenticated() &&
            this.usersService.isCurrentUserRole(Role.Admin);
        if (!isAuth) {
            this.router.navigate(['login']);
        }
        return isAuth;
    }
}