import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { TokenStorage } from 'src/app/token.storage';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { User } from 'src/app/app.models';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})

export class LoginComponent implements OnInit {
  public loginForm: FormGroup;
  public hide = true;
  error: '';
  public action = 0;
  constructor(public fb: FormBuilder,
    public router: Router,
    private tokenStorage: TokenStorage,
    public translate: TranslateService,
    public appService: AppService,
    private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.action = params.action;
      console.log('action =' + this.action);
    });

  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', Validators.compose([Validators.required, emailValidator])],
      password: [null, Validators.compose([Validators.required, Validators.minLength(6)])],
      rememberMe: false
    });
  }

  public onLoginFormSubmit(): void {
    if (this.loginForm.valid) {
      this.router.navigate(['/']);
    }
  }


  public login(values: any) {
    if (this.loginForm.valid) {
      const user: User = new User();
      user.userName = this.loginForm.controls.email.value;
      user.password = this.loginForm.controls.password.value;
      try {
        this.error = ''
        user.lang = this.translate.currentLang;
        console.log('Current lang=' + this.translate.currentLang);
        this.appService.authenticate(user)
          .subscribe(data => {
            console.log(data);
            if (data.token !== '' && data.token !== null) {
              console.log('login successful');
              this.tokenStorage.saveAuthData(data);
              this.appService.updateToken();
              console.log('action = '+this.action);
              if (this.action == 1) {
                this.router.navigate(['/submit-project/0']);
              } else {
                this.router.navigate(['/account/user/'+this.tokenStorage.getUserId()]);
              }
              // this.router.navigate([this.tokenStorage.getHomePage()]);
            } else {
              console.log('login failed');
              this.translate.get(['MESSAGE.INVALID_USER_PASS', 'COMMON.ERROR']).subscribe(res => {
                this.error = res['MESSAGE.INVALID_USER_PASS'];
              });
            }
          });
      } catch (e) {
        console.log('Exception during login...');
        this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
          this.error = res['MESSAGE.ERROR_OCCURRED'];
        });
      }
    }
  }

  public sendPassword() {
    try {
      const user: User = new User();
      user.userName = this.loginForm.controls.userName.value;
      console.log('Sending password for user: ' + user.userName);
      if (user.userName === null || user.userName === '') {
        this.translate.get(['VALIDATION.USER_NAME_REQUIRED', 'COMMON.ERROR']).subscribe(res => {
          this.error = res['VALIDATION.USER_NAME_REQUIRED'];
        });
      } else {
        this.appService.resetPassword(user)
          .subscribe(() => {
            this.translate.get(['MESSAGE.PASSWORD_SENT', 'COMMON.SUCCESS']).subscribe(res => {
              this.error = res['MESSAGE.PASSWORD_SENT'];
            })
          });
      }
    } catch (e) {
      this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
        this.error = res['MESSAGE.ERROR_OCCURRED'];
      });
    }
  }
}
