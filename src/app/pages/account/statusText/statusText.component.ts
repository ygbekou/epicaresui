import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { StatusText } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-statusText-component',
  templateUrl: './statusText.component.html',
  styleUrls: ['./statusText.component.scss']
})
export class StatusTextComponent extends BaseComponent implements OnInit {

  statusText: StatusText = new StatusText();
  messages: any;
  error: string;
  flag : any;

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage) {

    super(translate, tokenStorage);

  }

  ngOnInit() {
    this.flag = this.appService.getFlag();
    this.statusText.language = this.flag.code;
    this.getStatusText(this.flag);
  }

 getStatusText(flag: any) {
   this.messages = '';
   this.statusText = new StatusText();
   this.flag = flag ? flag : this.appService.getFlag();
   this.statusText.language = this.flag.code;

   console.log('Flag is set ...');

   const parameters: string[] = [];
    this.appService.getAllByCriteriaWithFiles('StatusText', parameters).subscribe((data: StatusText[]) => {
      data.forEach((statusText) => {
        if ( this.flag.code === statusText.language) {
          this.statusText = statusText;
        }
      });

    });
 }


 save() {
    this.statusText.modifiedBy = +this.tokenStorage.getUserId();
      this.appService.save(this.statusText, 'StatusText')
        .subscribe(result => {
          this.processResult(result, this.statusText, undefined);
        });
    }


}