import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Settings, AppSettings } from '../../app.settings';
import { AppService } from '../../app.service';
import { Pagination, PollDesc, EventDesc } from '../../app.models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-events',
  templateUrl: './event-items.component.html',
  styleUrls: ['./event-items.component.scss']
})
export class EventItemsComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: any;
  sidenavOpen = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  eventDescs: EventDesc[];
  viewType = 'grid';
  viewCol = 33.3;
  count = 12;
  sort: string;
  searchFields: any;
  removedSearchField: string;
  pagination: any;
  message: string;
  watcher: Subscription;
  lang = 'fr';
  processing = false;

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
    this.getEvents();
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  getEvents() {
    this.processing = true;
    const parameters: string[] = [];
    parameters.push('e.language = |language|' + this.lang + '|String');
    parameters.push('e.event.status IN |stb|1,2|ListI');
    this.appService.getAllByCriteriaWithFiles('EventDesc', parameters,
      ' order by e.event.rank asc').subscribe((data: EventDesc[]) => {
        this.eventDescs = data;
        console.log(this.eventDescs);
        this.count = this.eventDescs.length;
        this.pagination = new Pagination(1, this.count, null, 2, this.count, 0);
        this.message = null;
        this.processing = false;
      });
  }

  public getEvent() {
    console.log('getEvent called : ');
    console.log(this.eventDescs);
    const result = this.filterData(this.eventDescs);
    this.eventDescs.length = 0;
    if (result.data.length === 0) {
      this.eventDescs.length = 0;
      this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
      this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
        this.message = res['MESSAGE.NO_RESULT_FOUND'];
      });
      return false;
    }
    this.eventDescs = result.data;
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
      this.eventDescs.length = 0;
      if (event.search === 'ALL') {
        console.log('Display all clicked');
        this.getEvents();
      } else {
        console.log('Search criteria=' + event.search);
        const parameters: string[] = [];
        // parameters.push('e.language = |language|' + this.lang + '|String');
        parameters.push('e.title like |content|' + '%' + event.search + '%' + '|String');
        this.appService.getAllByCriteriaWithFiles('EventDesc', parameters,
          ' order by e.createDate desc').subscribe((data: EventDesc[]) => {
            this.eventDescs = data;
            this.count = this.eventDescs.length;
            this.pagination = new Pagination(1, this.count, null, 2, this.count, 0);
            this.message = null;
            if (this.eventDescs.length === 0) {
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
        this.eventDescs.length = 0;
      }
    });
    event.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      if (!this.settings.searchOnBtnClick) {
        this.getEvents();
      }
    });
  }

  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }

  public changeCount(count) {
    this.count = count;
    this.eventDescs.length = 0;
    this.resetPagination();
    this.getEvents();
  }

  public changeSorting(sort) {
    this.sort = sort;
    this.getEvents();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }

  public onPageChange(e) {
    this.pagination.page = e.pageIndex + 1;
    this.getEvents();
    window.scrollTo(0, 0);
  }

}