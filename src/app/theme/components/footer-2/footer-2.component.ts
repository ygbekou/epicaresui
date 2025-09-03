import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { emailValidator } from '../../utils/app-validators';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { ContactUsMessage, MailingList, CompanyLocation, Section } from 'src/app/app.models';
import { TokenStorage } from 'src/app/token.storage';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { Menu } from '../menu/menu.model';

@Component({
    selector: 'app-footer-2',
    templateUrl: './footer-2.component.html',
    styleUrls: ['./footer-2.component.scss']
})
export class Footer2Component extends BaseComponent implements OnInit {
    public subscribeForm: FormGroup;
    locations: CompanyLocation[] = [];
    // @Input('menuParentId') menuParentId;
    public menuItems: Array<Menu> = [];
    location: CompanyLocation = new CompanyLocation();
    location1: CompanyLocation = new CompanyLocation();

    iconSize = 'lg';
    iconColor = '';
    lang = 'fr';
    constructor(public formBuilder: FormBuilder, translate: TranslateService,
        protected tokenStorage: TokenStorage,
        public appService: AppService) { super(translate, tokenStorage); }

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
        this.lang = lang;


        const parameters: string[] = [];
        this.appService.getAllByCriteria('Location', parameters, 'order by e.rank ')
            .subscribe((data: CompanyLocation[]) => {
                this.locations = data;
                if (this.locations && this.locations.length > 0) {
                    this.location = this.locations[0];
                    this.location1 = this.locations[1];

                }
            },
                error => console.log(error),
                () => console.log('Get locatioms complete'));

        this.subscribeForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, emailValidator])]
        });

        this.getMenu();
    }

    public onSubscribeFormSubmit(values: any): void {
        this.messages = '';
        if (this.subscribeForm.valid) {
            const cmessage = new MailingList();
            cmessage.email = values.email;
            cmessage.modifiedBy = +this.tokenStorage.getUserId();
            const parameters: string[] = [];
            parameters.push('e.email = |email|' + values.email + '|String');
            this.appService.getAllByCriteria('com.wack.model.website.MailingList', parameters).subscribe((data1: MailingList[]) => {
                if (data1 && data1.length > 0) {
                    this.translate.get(['COMMON.SAVE', 'MESSAGE.ALREADY_SUSCRIBED']).subscribe(res => {
                        this.messages = res['MESSAGE.ALREADY_SUSCRIBED'];
                    });
                } else {
                    this.appService.save(cmessage, 'MailingList')
                        .subscribe(data => {
                            this.processResult(data, cmessage, null);
                            if (data.errors === null || data.errors.length === 0) {
                                this.subscribeForm.reset();
                            }
                        });
                }
            });
        }
    }


    getMenu() {
    const parameters: string[] = [];
    parameters.push('e.language = |language|' + this.lang + '|String');
    parameters.push('e.status = |status|1|Integer');
    parameters.push('e.showInMenu = |showInMenu|1|Integer');
    this.appService.getAllByCriteria('com.wack.model.website.Section', parameters, ' order by e.rank ')
      .subscribe((data: Section[]) => {
        this.menuItems.push(new Menu(1, this.lang === 'fr' ? 'Accueil' : 'Home', '/', null, null, false, 0));
        this.menuItems.push(new Menu(10, this.lang === 'fr' ? 'A Propos' : 'About us', null, null, null, true, 0));
        //this.menuItems.push(new Menu(20, this.lang === 'fr' ? 'Services' : 'Services', null, null, null, true, 0));
        // this.menuItems.push(new Menu(30, this.lang === 'fr' ? 'Kalmoudou' : 'Kalmoudou', null, null, null, true, 0));
        if (data.length > 0) {
          let j = 0;
          let k = 0;
          let l = 0;
          for (let i = 0; i < data.length; i++) {
            if (data[i].menu === 'SERVICES') {
              this.menuItems.push(new Menu(21 + j++, data[i].title, '/section/' + data[i].name, null, null, false, 20));
            } else if (data[i].menu === 'EXPERTISE') {
              this.menuItems.push(new Menu(31 + k++, data[i].title, '/section/' + data[i].name, null, null, false, 30));
            } else if (data[i].menu === 'ABOUTUS') {
              this.menuItems.push(new Menu(11 + l++, data[i].title, '/section/' + data[i].name, null, null, false, 10));
            }
          }
        }

        if (this.appService.company.displayMenuCareer) {
          this.menuItems.push(new Menu(40, this.lang === 'fr' ? 'Blogue' : 'Blog', '/blogs', null, null, false, 0));
        }

        // this.menuItems.push(new Menu(45, this.lang === 'fr' ? 'Projets' : 'Projects', '/projects', null, null, false, 0));

        this.menuItems.push(new Menu(50, 'Contact', '/contact', null, null, false, 0));

        if (this.appService.company.displayMenuCareer) {
          this.menuItems.push(new Menu(55, this.lang === 'fr' ? 'Carri�re' : 'Careers', '/careers', null, null, false, 0));
        }

        if (this.appService.company.displayMenuPoll) {
          this.menuItems.push(new Menu(60, this.lang === 'fr' ? 'Scrutins' : 'Polls', '/polls', null, null, false, 0));
        }

        if (this.appService.company.displayMenuProject) {
          this.menuItems.push(new Menu(65, this.lang === 'fr' ? 'Projets' : 'Projects', '/projects', null, null, false, 0));
        }

        if (this.appService.company.displayMenuEvent) {
          this.menuItems.push(new Menu(70, this.lang === 'fr' ? 'Evenements' : 'Events', '/events', null, null, false, 0));
        }

      }, error => console.log(error),
        () => console.log('Get Section complete'));
  }

    getLang(): string {
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
        this.lang = lang;
        return lang;
    }


}
