import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Faq } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings, Settings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-faqi-component',
  templateUrl: './faqi.component.html',
  styleUrls: ['./faqi.component.scss']
})
export class FaqiComponent extends BaseComponent implements OnInit {
  dataSource: MatTableDataSource<Faq>;
  public toolbarTypes = [1, 2];
  public headerTypes = ['default', 'image', 'carousel'];
  public flags = [
    { name: 'Francais', image: 'assets/images/flags/fr.svg', code: 'fr' },
    { name: 'English', image: 'assets/images/flags/gb.svg', code: 'en' }
  ];

  public flag: any;
  faq: Faq = new Faq();
  messages: any;
  error: string;
  public settings: Settings;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  formData: FormData;
  picture: any[];

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    private activatedRoute: ActivatedRoute) {

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
    if (lang === 'fr') {
      this.flag = this.flags[0];
    } else {
      this.flag = this.flags[1];
    }

    this.activatedRoute.params.subscribe(params => {
      this.getFaq(params.id);
    });
  }


  getFaq(faqId: number) {
    if (faqId === 0) {
      this.faq = new Faq();
    }

    if (faqId > 0)
      this.appService.getOneWithChildsAndFiles(faqId, 'com.wack.model.website.Faq')
        .subscribe(result => {
          if (result.id > 0) {
            this.faq = result;
          } else {
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {

              this.error = res['MESSAGE.READ_FAILED'];

            });
          }
        });
  }


  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  save() {

    this.faq.language = this.flag.name;
    this.faq.modifiedBy = +this.tokenStorage.getUserId();
    this.appService.save(this.faq, 'com.wack.model.website.Faq')
      .subscribe(data => {
        this.processResult(data, this.faq, null)
        this.faq = data;
      });

  }
}