import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Settings, AppSettings } from '../../app.settings';
import { AppService } from '../../app.service';
import { News, Pagination } from '../../app.models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TranslateService } from '@ngx-translate/core';


@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.scss']
})
export class BlogsComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public newses: News[];
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort: string;
  public searchFields: any;
  public removedSearchField: string;
  public pagination: any;
  public message: string;
  public watcher: Subscription;
  lang = 'fr';

  public settings: Settings
  constructor(public appSettings: AppSettings,
    public appService: AppService,
    protected translate: TranslateService,
    public mediaObserver: MediaObserver) {
       this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
    this.settings = appService.appSettings.settings;
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias === 'xs') {
        this.sidenavOpen = false;
        this.viewCol = 100;
      }
      else if (change.mqAlias === 'sm') {
        this.sidenavOpen = false;
        this.viewCol = 50;
      }
      else if (change.mqAlias === 'md') {
        this.viewCol = 50;
        this.sidenavOpen = true;
      }
      else {
        this.viewCol = 33.3;
        this.sidenavOpen = true;
      }
    });

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
    this.lang = lang;
    this.getNewsFromDB();
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  getNewsFromDB() {
    const parameters: string[] = [];
    parameters.push('e.language = |language|' + this.lang + '|String');
    parameters.push('e.status = |status|1|Integer');
    this.appService.getAllByCriteriaWithFiles('com.wack.model.News', parameters,
      ' order by e.publicationDatetime desc').subscribe((data: News[]) => {
        this.newses = data;
        this.count = this.newses.length;
        this.pagination = new Pagination(1, this.count, null, 2, this.count, 0);
        this.message = null;
      });
  }

  public getNews() {
    console.log('getNews called : ');
    console.log(this.newses);
    const result = this.filterData(this.newses);
    this.newses.length = 0;
    if (result.data.length === 0) {
      this.newses.length = 0;
      this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
      this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
        this.message = res['MESSAGE.NO_RESULT_FOUND'];
      });
      return false;
    }
    this.newses = result.data;
    this.pagination = result.pagination;
    this.message = null;
  }

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
  }

  public filterData(data) {
    console.log(data);
    return this.appService.filterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);
  }

  public searchClicked(event) {
    if (event.search) {
      this.newses.length = 0;
      if (event.search === 'ALL') {
        console.log('Display all clicked');
        this.getNewsFromDB();
      } else {
        console.log('Search criteria=' + event.search);
        const parameters: string[] = [];
        parameters.push('e.language = |language|' + this.lang + '|String');
        parameters.push('e.content like |content|' + '%' + event.search + '%' + '|String');
        this.appService.getAllByCriteriaWithFiles('com.wack.model.News', parameters,
          ' order by e.publicationDatetime desc').subscribe((data: News[]) => {
            this.newses = data;
            this.count = this.newses.length;
            this.pagination = new Pagination(1, this.count, null, 2, this.count, 0);
            this.message = null;
            if (this.newses.length === 0) {
              this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
                this.message = res['MESSAGE.NO_RESULT_FOUND'];
              });
            }
          });
      }
    }
    // window.scrollTo(0, 0);
  }

  public searchChanged(event) {
    event.valueChanges.subscribe(() => {
      this.resetPagination();
      this.searchFields = event.value;
      setTimeout(() => {
        this.removedSearchField = null;
      });
      if (!this.settings.searchOnBtnClick) {
        this.newses.length = 0;
      }
    });
    event.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      if (!this.settings.searchOnBtnClick) {
        this.getNews();
      }
    });
  }

  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }

  public changeCount(count) {
    this.count = count;
    this.newses.length = 0;
    this.resetPagination();
    this.getNews();
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.getNews();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }

  public onPageChange(e) {
    this.pagination.page = e.pageIndex + 1;
    this.getNews();
    window.scrollTo(0, 0);
  }

}