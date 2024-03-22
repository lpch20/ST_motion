import { Component, ChangeDetectorRef } from '@angular/core';
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthenticateService } from '../../services/authenticate.service';
import { TokenService } from '../../services/token.service';
import { ResultCode } from '../../../../../../datatypes/result';
import { Router } from '@angular/router';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { UsersService } from '../../services/users.service';
import { IUser } from '../../../../../../datatypes/user';

@Component({
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.scss']
})
export class EditProfileComponent {

  passCtrl: FormControl;
  newPassCtrl: FormControl;
  newPass2Ctrl: FormControl;

  form: FormGroup;
  password: string;
  newPass: string;
  newPass2: string;

  inputType = 'password';
  visible = false;

  user: string;
  res: string;
  currentUser: IUser;
  sendingImage: boolean;

  constructor(
    private http: HttpClient,
    private tokenService: TokenService,
    private router: Router,
    private authenticateService: AuthenticateService,
    private userService: UsersService,
    private cd: ChangeDetectorRef,
    fb: FormBuilder) {

    this.form = fb.group({
      password: ['', Validators.required],
      newPass: ['', Validators.required],
      newPass2: ['', Validators.required]
    });

    this.passCtrl = new FormControl('', [Validators.required, Validators.minLength(5)]);
    this.newPassCtrl = new FormControl('', { validators: Validators.required });
    this.newPass2Ctrl = new FormControl('', { validators: Validators.required });

    this.user = tokenService.getUserNameToken();

    this.userService.getCurrentUser().subscribe(
      response => {
        this.currentUser = response.data;
      }
    );
    this.sendingImage = false;
  }

  onFileChanged(event) {
    if (event.target.files && event.target.files.length) {
      this.sendingImage = true;
      let file = event.target.files[0]

      // this.http is the injected HttpClient
      const uploadData = new FormData();
      uploadData.append('image', file, file.name);

      this.http.post('/api/users/updateImage', uploadData, {
        reportProgress: true,
        observe: 'events'
      }).subscribe(event => {
        if (event) {
          switch (event.type) {
            /**
             * The request was sent out over the wire.
             */
            case HttpEventType.Sent:
              this.res = 'Enviando pedido...';
              break;
            /**
             * An upload progress event was received.
             */
            case HttpEventType.UploadProgress:
              this.res = 'Comenzando envío de imagen...';
              break;
            /**
             * The response status code and headers were received.
             */
            case HttpEventType.ResponseHeader:
              this.res = 'Controlando estado...';
              break;
            /**
             * A download progress event was received.
             */
            case HttpEventType.DownloadProgress:
              this.res = 'Enviando imagen...';
              break;
            /**
             * The full response including the body was received.
             */
            case HttpEventType.Response:
              this.res = 'Envio completo.';
              window.location.reload();
              break;
          }
        }
      }, err => {
        this.sendingImage = false;
        this.res = err ? (err.message ? err.message : err) : 'Error al actualizar la imagen';
      });
    }
  }

  changePasswordAndLogin() {
    let username = this.tokenService.getUserNameToken();

    this.authenticateService.changePasswordAndLogin(username, this.password, this.newPass).subscribe(
      res => {
        if (res.result == ResultCode.OK) {
          this.router.navigate(['login']);
        } else {
          console.error(res.message);
        }
      },
      err => {
        console.error(err);
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
}