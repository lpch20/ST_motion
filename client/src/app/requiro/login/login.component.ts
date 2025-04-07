import { ChangeDetectorRef, Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { ParameterType } from '../../../../../datatypes/ParameterType';
import { ResultCode } from '../../../../../datatypes/result';
import { fadeOutAnimation } from '../../core/common/route.animation';
import { SidenavItem } from '../../core/sidenav/sidenav-item/sidenav-item.interface';
import { SidenavService } from '../../core/sidenav/sidenav.service';
import { AuthenticateService } from '../services/authenticate.service';
import { MenuService } from '../services/menu.service';
import { ParameterService } from '../services/parameter.service';
import { TokenService } from '../services/token.service';
import { UsersService } from '../services/users.service';
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

  @ViewChild('callAPIDialog') callAPIDialog: TemplateRef<any>;

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

  conn_time: ParameterType;
  inactive_time: ParameterType;
  corto_time: ParameterType;
  option_time: ParameterType;
  filter_time: ParameterType;
  extra_time: ParameterType;
  request_time: ParameterType;
  autocall_time: ParameterType;
  message: ParameterType;
  parameters: ParameterType[];

  constructor(
    public snackBar: MatSnackBar,
    private authenticateService: AuthenticateService,
    private tokenService: TokenService,
    private usersService: UsersService,
    private sidenavService: SidenavService,
    private menuService: MenuService,
    private router: Router,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    private dialog: MatDialog,
    private parameterService: ParameterService,
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

          this.parameterService.getParameters().subscribe(
            response => {
              if (response.result > 0 && response.data && response.data.length > 0) {
                this.parameters = response.data;

                this.conn_time = this.parameters.filter(x => x.name.toUpperCase() == "CONN_TIME")[0];
                this.corto_time = this.parameters.filter(x => x.name.toUpperCase() == "CORTO_TIME")[0];
                this.inactive_time = this.parameters.filter(x => x.name.toUpperCase() == "INACTIVE_TIME")[0];
                this.option_time = this.parameters.filter(x => x.name.toUpperCase() == "OPTION_TIME")[0];
                this.filter_time = this.parameters.filter(x => x.name.toUpperCase() == "FILTER_TIME")[0];
                this.extra_time = this.parameters.filter(x => x.name.toUpperCase() == "EXTRA_TIME")[0];
                this.request_time = this.parameters.filter(x => x.name.toUpperCase() == "REQUEST_TIME")[0];
                this.autocall_time = this.parameters.filter(x => x.name.toUpperCase() == "AUTOCALL_TIME")[0];
                this.message = this.parameters.filter(x => x.name.toUpperCase() == "MESSAGE")[0];
                window.localStorage.setItem('conn_time', JSON.stringify(this.conn_time));
                window.localStorage.setItem('inactive_time', JSON.stringify(this.inactive_time));
                window.localStorage.setItem('corto_time', JSON.stringify(this.corto_time));
                window.localStorage.setItem('option_time', JSON.stringify(this.option_time));
                window.localStorage.setItem('filter_time', JSON.stringify(this.filter_time));
                window.localStorage.setItem('extra_time', JSON.stringify(this.extra_time));
                window.localStorage.setItem('request_time', JSON.stringify(this.request_time));
                window.localStorage.setItem('autocall_time', JSON.stringify(this.autocall_time));
                window.localStorage.setItem('message', JSON.stringify(this.message));
                window.localStorage.removeItem("currentCustomer")
                window.localStorage.removeItem('lastCall')
                window.localStorage.removeItem('time');
                this.tokenService.setToken(res.data.tokenId, res.data.user, res.data.accountId, res.data.rolId, this.agent);
                this.updateMenu(() => {
                  new Util(this.router, this.usersService).redirectByRole(res.data.rolId);
                });
              }
            },
            error => {
              console.error(error);
            }
          );

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
