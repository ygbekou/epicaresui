import { Component, OnInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { StatusText, Regulation } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-regulation-component',
  templateUrl: './regulation.component.html',
  styleUrls: ['./regulation.component.scss']
})
export class RegulationComponent extends BaseComponent implements OnInit {

  regulation: Regulation = new Regulation();
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
    this.regulation.language = this.flag.code;
    this.getRegulation(this.flag);
  }

 getRegulation(flag: any) {
   this.messages = '';
   this.regulation = new Regulation();
   this.flag = flag ? flag : this.appService.getFlag();
   this.regulation.language = this.flag.code;

   const parameters: string[] = [];
    this.appService.getAllByCriteriaWithFiles('Regulation', parameters).subscribe((data: Regulation[]) => {
      data.forEach((regulation) => {
        if ( this.flag.code === regulation.language) {
          this.regulation = regulation;
        }
      });

    });
 }


 save() {
    this.regulation.modifiedBy = +this.tokenStorage.getUserId();
      this.appService.save(this.regulation, 'Regulation')
        .subscribe(result => {
          this.processResult(result, this.regulation, undefined);
        });
    }


}