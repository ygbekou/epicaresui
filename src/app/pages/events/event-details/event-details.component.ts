import { Component, OnInit, ViewChild, OnDestroy, ViewChildren, QueryList } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Event, Pagination, EventDesc } from 'src/app/app.models';
import { ActivatedRoute } from '@angular/router';
import { Settings, AppSettings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: any;
  @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public sidenavOpen = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  event: Event;
  eventDesc: EventDesc;
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
  messages: string;

  config: SwiperConfigInterface = {};
  config2: SwiperConfigInterface = {};

  settings: Settings

  constructor(public appSettings: AppSettings,
    public appService: AppService,
    protected translate: TranslateService,
    public mediaObserver: MediaObserver,
    private activatedRoute: ActivatedRoute) {

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
    this.activatedRoute.params.subscribe(params => {
      if (Number(params.id) > 0) {
        this.getDescriptions(params.id);
      }
    });

    this.config = {
      observer: false,
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false
      }
    };

    this.config2 = {
      observer: false,
      slidesPerView: 4,
      spaceBetween: 16,
      keyboard: true,
      navigation: false,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        480: {
          slidesPerView: 2
        },
        600: {
          slidesPerView: 3,
        }
      }
    };
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  getDescriptions(eventId: number) {
    this.messages = '';

    this.appService.getOneWithChildsAndFiles(eventId, 'com.wack.model.Event')
      .subscribe(result => {
        if (result.id > 0) {
          this.event = result;

          for (let ed of this.event.eventDescs) {
            if (ed.language === this.appService.getFlag().code) {
              this.eventDesc = ed;
              break;
            }
          }
        }
      },
        error => console.log(error),
        () => console.log('Get all event desc complete'));
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

  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }

  public changeCount(count) {
    this.count = count;
    this.resetPagination();
  }
  public changeSorting(sort) {
    this.sort = sort;
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }

  public onPageChange(e) {
    this.pagination.page = e.pageIndex + 1;
    window.scrollTo(0, 0);
  }

  public onOpenedChange() {
    this.swipers.forEach(swiper => {
      if (swiper) {
        swiper.update();
      }
    });
  }

  public selectImage(index: number) {
    this.swipers.forEach(swiper => {
      if (swiper.elementRef.nativeElement.id === 'main-carousel') {
        swiper.setIndex(index);
      }
    });
  }

  public onIndexChange(index: number) {
    this.swipers.forEach(swiper => { 
      const elem = swiper.elementRef.nativeElement;
      if (elem.id === 'small-carousel') {
        swiper.setIndex(index);
        for (let i = 0; i < elem.children[0].children.length; i++) {
          const element = elem.children[0].children[i];
          if (element.classList.contains('thumb-' + index)) {
            element.classList.add('active-thumb');
          }
          else {
            element.classList.remove('active-thumb');
          }
        }
      }
    });
  }

}