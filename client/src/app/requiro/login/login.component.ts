import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { fadeOutAnimation } from '../../core/common/route.animation';
import { AuthenticateService } from '../services/authenticate.service';
import { TokenService } from '../services/token.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ResultCode } from '../../../../../datatypes/result';
import { UsersService } from '../services/users.service';
import { Role } from '../../../../../datatypes/enums';
import { MenuService } from '../services/menu.service';
import { SidenavService } from '../../core/sidenav/sidenav.service';
import { SidenavItem } from '../../core/sidenav/sidenav-item/sidenav-item.interface';
import { Util } from '../utils/util';

@Component({
  selector: 'fury-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  host: {
    '[@fadeOutAnimation]': 'true'
  },
  animations: [fadeOutAnimation]
})
export class LoginComponent implements OnInit {

  userCtrl: FormControl;
  passCtrl: FormControl;
  newPassCtrl: FormControl;
  newPass2Ctrl: FormControl;

  form: FormGroup;
  username: string;
  password: string;
  newPass: string;
  newPass2: string;
  agent: string;
  newPassword: boolean = false;

  inputType = 'password';
  visible = false;

  constructor(
    public snackBar: MatSnackBar,
    private authenticateService: AuthenticateService,
    private tokenService: TokenService,
    private usersService: UsersService,
    private sidenavService: SidenavService,
    private menuService: MenuService,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      agent: ['', Validators.required]
    });
    this.userCtrl = new FormControl('', { validators: Validators.required });
    this.passCtrl = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.newPassCtrl = new FormControl('', { validators: Validators.required });
    this.newPass2Ctrl = new FormControl('', { validators: Validators.required });

    if (this.usersService.getCurrentUserName()) {
      this.usersService.getRolCurrentUser().subscribe(
        response => {
          if (response.result == ResultCode.OK && response.data) {
            let rolId = response.data[0].rol_id;
            new Util(this.router, this.usersService).redirectByRole(rolId);
          }
        }
      );
    }
  }

  login() {
    this.authenticateService.login(this.username, this.password, this.agent).subscribe(
      res => {
        if (res.result == ResultCode.OK) {
          this.tokenService.setToken(res.data.tokenId, res.data.user, res.data.accountId, res.data.rolId, this.agent);
          this.updateMenu(() => {
            new Util(this.router, this.usersService).redirectByRole(res.data.rolId);
          });
        } else {
          if (res.message == "Por favor, actualize su contraseña") {
            this.newPassword = true;
          } else {
            this.snackBar.open(res.message, "Cerrar", { duration: 4000 });
          }
        }
      },
      err => {

      }
    );
  }

  changePasswordAndLogin() {
    this.authenticateService.changePasswordAndLogin(this.username, this.password, this.newPass).subscribe(
      res => {
        console.log(res);
        if (res.result == ResultCode.OK) {
          this.tokenService.setToken(res.data.tokenId, res.data.user, res.data.accountId, res.data.rolId, this.agent);
          this.updateMenu(() => {
            new Util(this.router, this.usersService).redirectByRole(res.data.rolId);
          });
        } else {
          if (res.message === "Por favor actulize su contraseña") {
            this.newPassword = true;
          } else {
            this.snackBar.open(res.message, "Cerrar", { duration: 4000 });
          }
        }
      },
      err => {

      }
    );
  }

  show() {
    this.inputType = 'text';
    this.visible = true;
    this.cd.markForCheck();
  }

  hide() {
    this.inputType = 'password';
    this.visible = false;
    this.cd.markForCheck();
  }

  updateMenu(callback: () => void): void {
    const menu: SidenavItem[] = [];
    this.menuService.menuByRol().subscribe(
      response => {
        if (response.result > 0) {
          let menus = response.data;
          for (let i = 0; i < menus.length; i++) {
            menu.push({
              name: menus[i].label,
              routeOrFunction: menus[i].path,
              icon: menus[i].icon,
              position: menus[i].position,
              pathMatchExact: true
            });
          }
        }
        // Send all created Items to SidenavService
        this.sidenavService.setItems(menu);
        callback();
      }
    );
  }
}
