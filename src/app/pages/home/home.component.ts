import { Component, OnInit } from '@angular/core';
import { Settings, AppSettings } from '../../app.settings';
import { AppService } from '../../app.service';
import { News, Pagination } from '../../app.models';

import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  watcher: Subscription;
  activeMediaQuery = '';

  public slides = [];
  public viewType: string = 'grid';
  public viewCol: number = 25;
  public count: number = 8;
  public sort: string;
  public searchFields: any;
  public removedSearchField: string;
  public pagination: Pagination = new Pagination(1, 8, null, 2, 0, 0);
  public message: string;
  public featuredBlogs: News[] = [];
  lang= 'fr';

  public settings: Settings;
  constructor(public appSettings: AppSettings,
    translate: TranslateService,
    public appService: AppService,
    public mediaObserver: MediaObserver) {
    this.settings =  appService.appSettings.settings;
    console.log('App settings from home');
    console.log(this.appSettings.settings);
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      // console.log(change)
      if (change.mqAlias == 'xs') {
        this.viewCol = 100;
      }
      else if (change.mqAlias == 'sm') {
        this.viewCol = 50;
      }
      else if (change.mqAlias == 'md') {
        this.viewCol = 33.3;
      }
      else {
        this.viewCol = 25;
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
    this.getSlides();
    //this.getNewsFromDB();
  }

  ngDoCheck() {
    if (this.settings.loadMore.load) {
      this.settings.loadMore.load = false; 
    }
  }

  ngOnDestroy() {
    this.resetLoadMore();
    this.watcher.unsubscribe();
  }

  public getSlides() {
    this.appService.getHomeCarouselSlides().subscribe(res => {
      this.slides = res;
    })
  }

  getNewsFromDB() {
    const parameters: string[] = [];
    parameters.push('e.language = |language|' + this.lang + '|String');
    parameters.push('e.status = |status|1|Integer');
    parameters.push('e.featured = |featured|1|Integer');
    this.appService.getAllByCriteriaWithFiles('com.wack.model.News', parameters).subscribe((data: News[]) => {
      this.featuredBlogs = data;
      this.count = this.featuredBlogs.length;
      this.pagination = new Pagination(1, this.count, null, 2, this.count, 0);
      this.message = null;
    });
  }


  public resetLoadMore() {
    this.settings.loadMore.complete = false;
    this.settings.loadMore.start = false;
    this.settings.loadMore.page = 1;
    this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
  }

  public filterData(data) {
    return this.appService.filterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);
  }

  public searchClicked() {  
  }
  public searchChanged(event) {
    event.valueChanges.subscribe(() => {
      this.resetLoadMore();
      this.searchFields = event.value;
      setTimeout(() => {
        this.removedSearchField = null;
      });
      if (!this.settings.searchOnBtnClick) {
        //this.properties.length = 0;
      }
    });
    event.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      if (!this.settings.searchOnBtnClick) {
        //this.getProperties();
      }
    });
  }
  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }



  public changeCount(count) {
    this.count = count;
    this.resetLoadMore();
    //this.properties.length = 0;
    //this.getProperties();

  }
  public changeSorting(sort) {
    this.sort = sort;
    this.resetLoadMore();
    //this.properties.length = 0;
    //this.getProperties();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public getFeaturedProperties() {
    this.appService.getFeaturedProperties().subscribe(properties => {
      this.featuredBlogs = properties;
    })
  }

}
