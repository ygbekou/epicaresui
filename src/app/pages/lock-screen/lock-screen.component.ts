import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TokenStorage } from 'src/app/token.storage';
import { User } from 'src/app/app.models';
import { AppService } from 'src/app/app.service';
import { TranslateCompiler, TranslateService } from '@ngx-translate/core';
import { PlatformLocation } from '@angular/common';

@Component({
  selector: 'app-lock-screen',
  templateUrl: './lock-screen.component.html',
  styleUrls: ['./lock-screen.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LockScreenComponent implements OnInit {
  public date: any = new Date();
  public timerInterval: any;
  public form: FormGroup;
  error = '';
  constructor(public fb: FormBuilder,
    private appService: AppService,
    private translate: TranslateService,
    location: PlatformLocation,
    public tokenStorage: TokenStorage,
    public router: Router) {

    location.onPopState(() => {
      console.log('pressed back!');
      this.logout();
    });

  }

  ngOnInit() {
    this.timerInterval = setInterval(() => {
      this.date = new Date();
    }, 1000);
    this.form = this.fb.group({
      password: [null, Validators.compose([Validators.required, Validators.minLength(3)])]
    });
  }

  ngAfterViewInit() {
    document.getElementById('preloader').classList.add('hide');
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
    console.log('Lock screen Destroy : ');
  }

  public onSubmit(values: Object): void {
    if (this.form.valid) {
      this.login();
    }
  }
  logout() {
    this.tokenStorage.clearAuthData();
    this.router.navigate(['/login']);
  }

  public login() {
    const user: User = new User();
    user.password = this.form.controls.password.value;
    user.userName = this.tokenStorage.getUserName();
    try {
      this.error = ''
      this.appService.authenticate(user)
        .subscribe(data => {
          console.log(data);
          if (data.token !== '' && data.token !== null) {
            console.log('login successful');
            this.tokenStorage.saveAuthData(data);
            this.appService.updateToken();
            this.router.navigate(['/account/admin']);
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
