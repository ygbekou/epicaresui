import { Component, OnInit } from '@angular/core';
import { Settings, AppSettings } from './app.settings';
import { Router, NavigationEnd } from '@angular/router';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TranslateService } from '@ngx-translate/core';
import { MenuService } from './theme/components/menu/menu.service';
import { AppService } from './app.service';
import { Company } from './app.models';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  providers: [MenuService, AppService]
})
export class AppComponent implements OnInit {
  lang = 'fr';
  public settings: Settings;
  // appService: any;
  constructor(public appSettings: AppSettings, public appService: AppService,
    public router: Router, public translate: TranslateService) {

    let lang = navigator.language;
    if (lang) {
      lang = lang.substring(0, 2);
    }
    if (Cookie.get('lang')) {
      this.translate.use(Cookie.get('lang'));
      lang=Cookie.get('lang');
      console.log('Using cookie lang=' + Cookie.get('lang'));
    } else if (lang) {
      console.log('Using browser lang=' + lang);
      this.translate.use(lang);
    } else {
      this.translate.use('fr');
      console.log('Using default lang=fr');
    }
    this.lang = lang;
    console.log('Setting ='+this.lang);
    this.initCompany();
    registerLocaleData(localeFr);
  }

  ngOnInit(): void {

  }

  ngAfterViewInit() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        setTimeout(() => {
          window.scrollTo(0, 0);
        });
      }
    });
  }

  initCompany() {
    const parameters: string[] = [];
    if (this.appService)
      this.appService.getAllByCriteria('Company', parameters)
        .subscribe((data: Company[]) => {
          this.appService.companies = data;
          if (this.appService.companies.length > 0) {
            this.appService.companies.forEach(aCompany => {
              if (this.lang === aCompany.language) {
                this.appService.company = aCompany;
                this.appService.company.currencyCode = '$';
                this.appService.appSettings.settings =
                  new Settings(
                    'Bat & Bel',  // theme name
                    this.appService.company.themeColor,      // blue, green, red, pink, purple, grey, orange-dark
                    this.appService.company.headerTextPosition,           // 0, 1 or 2
                    (this.appService.company.fixedMenu === 1 ? true : false),        // true = sticky, false = not sticky
                    this.appService.company.headerImageType,   // default, image, carousel
                    (this.appService.company.leftToRight === 1 ? true : false),       // true = rtl, false = ltr
                    1,           //  1, 2  or 3
                    false,       //  true = search on button click
                    'USD',       // USD, EUR

                    // NOTE:  don't change additional options values, they used for theme performance
                    false,
                    false,
                    false,
                    {
                      start: false,
                      step: 1,
                      load: false,
                      page: 1,
                      complete: false,
                      result: 0
                    }
                  ); 
                this.settings = this.appService.appSettings.settings; 
              }
            });
          }
        },
          error => console.log(error),
          () => console.log('Get Company complete'));
  }

}
