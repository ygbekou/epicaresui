import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings, Settings } from 'src/app/app.settings';
import { Company, CompanyLocation, SectionItem } from 'src/app/app.models';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-my-properties',
  templateUrl: './configs.component.html',
  styleUrls: ['./configs.component.scss']
})
export class ConfigsComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'telephone', 'actions'];
  dataSource: MatTableDataSource<CompanyLocation>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  public toolbarTypes = [0, 1, 2];
  public headerTypes = ['default', 'image', 'carousel'];
  public footerTypes = ['Footer-1', 'Footer-2', 'Footer-3'];
  public flags = [
    { name: 'Francais', image: 'assets/images/flags/fr.svg', code: 'fr' },
    { name: 'English', image: 'assets/images/flags/gb.svg', code: 'en' }
  ];
  formData = new FormData();
  flag: any;
  company: Company = new Company();
  companies: Company[] = [];
  location: CompanyLocation = new CompanyLocation();
  messages: any;
  logos: any;
  favicons: any;
  careers: any;
  polls: any;
  projects: any;
  settings: Settings;
  selectedTab = 0;s
  selectedMainTabIndex = 0;
  constructor(public appService: AppService,
    public appSettings: AppSettings,
    private translate: TranslateService) {
    this.settings = appService.appSettings.settings;
  }

  edit(si: CompanyLocation) {
    this.location = si;
    this.selectedTab = 1;
  }
  public changeTheme(theme) {
    this.settings.theme = theme;
    this.company.themeColor = theme;
    this.appService.appSettings.settings.theme = theme;
  }

  public chooseToolbarType() {
    this.settings.toolbar = this.company.headerTextPosition;
    this.appService.appSettings.settings.toolbar = this.company.headerTextPosition;
    // window.scrollTo(0, 0);
  }

  public chooseHeaderType() {
    this.settings.header = this.company.headerImageType;
    this.appService.appSettings.settings.header = this.company.headerImageType;
    // window.scrollTo(0, 0);
    // this.router.navigate(['/']);
  }

  public chooseFooterType() {
    this.appService.company.footerType = this.company.footerType;
  }

  public changeLang(flag) {
    let found = false;
    this.flag = flag;
    this.companies.forEach(aCompany => {
      if (flag.code === aCompany.language) {
        this.company = aCompany;
        found = true;
      }
    });
    if (!found) {
      this.company = new Company();
      this.company.language = flag.code;
    }
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

    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;

    const parameters: string[] = [];
    this.appService.getAllByCriteria('Company', parameters)
      .subscribe((data: Company[]) => {
        this.companies = data;
        let found = false;
        if (this.companies.length > 0) {
          this.companies.forEach(aCompany => {
            if (lang === aCompany.language) {
              this.company = aCompany;
              found = true;
            }
          });
        }
        if (!found) {
          this.company = new Company();
          this.company.language = lang;
        }
      },
        error => console.log(error),
        () => console.log('Get Company complete'));


    this.appService.getAllByCriteria('Location', parameters, 'order by e.rank ')
      .subscribe((data: CompanyLocation[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get locatioms complete'));

  }

  onMainTabChanged($event) {
    console.log('Selectd main = ' + this.selectedMainTabIndex);
    this.messages = '';
    if (this.selectedMainTabIndex === 5) {
      this.selectedTab = 0;
    }
  }
  save() {
    this.formData = new FormData();
    let nbFiles = 0;
    const isNew = !(this.company.id > 0);
    if (this.company.fixedMenu.toString() === 'true') {
      this.company.fixedMenu = 1;
    }
    if (this.company.leftToRight.toString() === 'true') {
      this.company.leftToRight = 1;
    }
    if (this.company.fixedMenu.toString() === 'false') {
      this.company.fixedMenu = 0;
    }
    if (this.company.leftToRight.toString() === 'false') {
      this.company.leftToRight = 0;
    }

    for (let i = 0; i < this.favicons.length; i++) {
      nbFiles++;
      this.formData.append('file[]', this.favicons[i].file, 'favicon.ico');
    }

    for (let i = 0; i < this.logos.length; i++) {
      nbFiles++;
      this.formData.append('file[]', this.logos[i].file, 'logo.png');
    }

    for (let i = 0; i < this.careers.length; i++) {
      nbFiles++;
      this.formData.append('file[]', this.careers[i].file, 'careers.jpg');
    }

    for (let i = 0; i < this.polls.length; i++) {
      nbFiles++;
      this.formData.append('file[]', this.polls[i].file, 'polls.jpg');
    }

    for (const prj of  this.projects) {
      nbFiles++;
      this.formData.append('file[]', prj.file, 'projects.jpg');
    }

    try {
      if (nbFiles > 0) {
        this.company.useId = false;
        this.appService.saveWithFile(this.company, 'Company', this.formData, 'saveWithFile')
          .subscribe(result => {
            if (result.id > 0) {
              this.company = result;
              this.appService.initCompany();
              if (isNew) {
                this.companies.push(this.company);
              }
              this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_SUCCESS'];
              });
            } else {
              this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
              });
            }
          });
      } else {
        this.appService.save(this.company, 'Company')
          .subscribe(result => {
            if (result.id > 0) {
              this.company = result;
              this.appService.initCompany();
              if (isNew) {
                this.companies.push(this.company);
              }
              this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_SUCCESS'];
              });
            } else {
              this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
              });
            }
          });
      }
    } catch (e) {
      this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
        this.messages = res['MESSAGE.ERROR_OCCURRED'];
      });
      console.log(e);
    }
  }

  clear() {
    this.location = new CompanyLocation();
    this.dataSource = new MatTableDataSource();
  }


  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  addLocation() {
    this.selectedTab = 1;
    this.location = new CompanyLocation();
  }

  public remove(location: CompanyLocation) {
    this.messages = '';
    this.appService.delete(location.id, 'com.wack.model.Location')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(location);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<CompanyLocation>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        } else if (resp.result === 'FOREIGN_KEY_FAILURE') {
          this.translate.get(['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY', 'COMMON.ERROR']).subscribe(res => {
            this.messages = res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'];
          });
        } else {
          this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
            this.messages = res['MESSAGE.ERROR_OCCURRED'];
          });
        }
      });
  }
  saveLocation() {
    this.messages = '';
    try {
      this.messages = '';
      const index: number = this.dataSource.data.indexOf(this.location);
      this.appService.save(this.location, 'Location')
        .subscribe(result => {
          if (result.id > 0) {
            this.location = new CompanyLocation();
            this.selectedTab = 0;
            if (index !== -1) {
              this.dataSource.data.splice(index, 1);
            }
            this.dataSource.data.push(result);
            this.dataSource = new MatTableDataSource<CompanyLocation>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
            this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_SUCCESS'];
            });
          } else {
            this.selectedTab = 1;
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        });

    } catch (e) {
      console.log(e);
    }
  }

}