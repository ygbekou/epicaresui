import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { AppService } from 'src/app/app.service';
import { ContactUsMessage } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/token.storage';
import { BaseComponent } from 'src/app/shared/baseComponent';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent extends BaseComponent implements OnInit {
  public contactForm: FormGroup;
  public lat = 40.678178;
  public lng = -73.944158;
  public zoom = 12;

  constructor(public appService: AppService,
    public formBuilder: FormBuilder,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage) {
    super(translate, tokenStorage);
  }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: [''],
      message: ['', Validators.required]
    });
  }

  public onContactFormSubmit(values: any): void {
    this.messages = '';
    if (this.contactForm.valid) {
      const cmessage = new ContactUsMessage();
      cmessage.name = values.name;
      cmessage.email = values.email;
      cmessage.phone = values.phone;
      cmessage.message = values.message;
      cmessage.modifiedBy = +this.tokenStorage.getUserId();
      cmessage.lang = this.getLang();

      this.appService.saveWithUrl('/service/ContactUsMessage/save', cmessage)
        .subscribe(data => {
          this.processResult(data, cmessage, null);
          if (data.errors === null || data.errors.length === 0) {
            this.contactForm.reset();
          }
        });
    }
  }

}
