import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { matchingPasswords, emailValidator } from 'src/app/theme/utils/app-validators';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { TokenStorage } from 'src/app/token.storage';
import { User } from 'src/app/app.models';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  public registerForm: FormGroup;
  public hide = true;
  error = '';
  public action = 0;
  public userGroups = [];
  constructor(public fb: FormBuilder,
    public router: Router,
    private tokenStorage: TokenStorage,
    public snackBar: MatSnackBar,
    public translate: TranslateService,
    public appService: AppService,
    private route: ActivatedRoute) {

    this.route.params.subscribe(params => {
      this.action = params.action;
      console.log('action =' + this.action);
    });

    if (this.translate.currentLang === 'fr') {
      this.userGroups = [
        { id: 4, name: 'Client', type: 'UserGroup' },
        { id: 5, name: 'Editeur', type: 'UserGroup' },
        { id: 100, name: 'Autre', type: 'UserGroup' }
      ];
    } else {
      this.userGroups = [
        { id: 4, name: 'Client', type: 'UserGroup' },
        { id: 5, name: 'Editor', type: 'UserGroup' },
        { id: 100, name: 'Other', type: 'UserGroup' }
      ];
    }

  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      sex: ['', Validators.required],
      phone: ['', Validators.required],
      // userName: ['', Validators.compose([Validators.required, Validators.minLength(6)])],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      receiveNewsletter: true
    }, { validator: matchingPasswords('password', 'confirmPassword') });
  }

  public onRegisterFormSubmit(values: User): void {
    if (this.registerForm.valid) {
      console.log(values);
      const user: User = values;
      user.type = 'User';
      console.log(user);
      this.appService.saveUserAndLogin(user)
        .subscribe(data => {
          if (data.token === 'E') {
            this.translate.get(['VALIDATION.EMAIL_USED', 'COMMON.ERROR']).subscribe(res => {
              this.error = res['VALIDATION.EMAIL_USED'];
            });
          } else if (data.token === 'S') {
            this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
              this.error = res['MESSAGE.ERROR_OCCURRED'];
            });
          } else {
            this.tokenStorage.saveAuthData(data);
            this.appService.updateToken();
            console.log('Token = ' + this.tokenStorage.getToken());
            console.log('action = '+this.action);
            if (this.action == 1) {
              this.router.navigate(['/submit-project/0']);
            } else {
              this.router.navigate(['/account/user/'+this.tokenStorage.getUserId()]);
            }

          }
        });
    }
  }
}
