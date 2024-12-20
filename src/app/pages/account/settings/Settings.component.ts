import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { AppSettings } from 'src/app/app.settings';
import { TokenStorage } from 'src/app/token.storage';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-settings-component',
  templateUrl: './Settings.component.html',
  styleUrls: ['./Settings.component.scss']
})
export class SettingsComponent extends BaseComponent implements OnInit {

  selected = new FormControl(0);

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    private changeDetectedRef: ChangeDetectorRef) {
      super(translate, tokenStorage);
    }

  ngOnInit() {

  }

}
