import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Email } from 'src/app/app.models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-email-component',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent extends BaseComponent implements OnInit {

  email: Email = new Email();
  messages: any;
  error: string;

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage) {

    super(translate, tokenStorage);

  }

  ngOnInit() {
    let lang = navigator.language;
    if (lang) {
      lang = lang.substring(0, 2);
    }
    if (Cookie.get('lang')) {
      lang = Cookie.get('lang');
      console.log('Using cookie lang=' + Cookie.get('lang'));
    } else if (lang) {
      console.log('Using browser lang=' + lang);
      // this.translate.use(lang);
    } else {
      lang = 'fr';
      console.log('Using default lang=fr');
    }
  }

  sendEmail() {
      this.appService.saveWithUrl('/service/user/email/sendMassEmail', this.email)
        .subscribe(data => {
          this.processResult(data, this.email, null);
          if (data.errors === null || data.errors.length === 0) {
            //this.contactForm.reset();
          }
        });
  }

  clear() {
    this.email = new Email();
  }

}