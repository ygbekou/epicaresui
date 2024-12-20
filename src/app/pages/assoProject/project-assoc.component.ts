import { Component, OnInit, ViewChild, ViewChildren, QueryList } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Project, ProjectDesc } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings, Settings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Component({
  selector: 'app-project-assoc-component',
  templateUrl: './project-assoc.component.html',
  styleUrls: ['./project-assoc.component.scss']
})
export class ProjectAssocComponent extends BaseComponent implements OnInit {

  @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public sidenavOpen = true;
  project: Project = new Project();
  projectDesc: ProjectDesc = new ProjectDesc();
  chartData: any;
  dashboard: any;
  chartType = 'bar';
  tagValue = '0';
  viewCol = 33.3;

  error: string;
  formData: FormData;
  files: any[];
  picture: any;
  action = 'submitting';
  watcher: Subscription;
  panelOpenState = false;

  config: SwiperConfigInterface = {};
  config2: SwiperConfigInterface = {};

  public flags = [
    { name: 'Francais', image: 'assets/images/flags/fr.svg', code: 'fr' },
    { name: 'English', image: 'assets/images/flags/gb.svg', code: 'en' }
  ];
  public flag: any;

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    public mediaObserver: MediaObserver,
    private activatedRoute: ActivatedRoute) {

    super(translate, tokenStorage);

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
    this.clear();
    this.activatedRoute.params.subscribe(params => {
      if (Number(params.id) > 0) {
        this.getChart(params.id);
        this.getProject(params.id);
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

  clearMessages() {
    this.messages = '';
  }

  clear() {
    this.project = new Project();
  }

  getProject(projectId: number) {
    this.messages = '';

    this.appService.getOneWithChildsAndFiles(projectId, 'Project')
      .subscribe(result => {
        if (result.id > 0) {
          console.log(result);
          this.project = result;

          for (const pd of this.project.projectDescs) {
            if (this.getLang() === pd.language) {
              this.projectDesc = {...pd};
            }
          }

          this.project.viewCount++;
          this.appService.save(this.project, 'Project').subscribe(result2 => {
            // do nothing
          });
        }
      },
        error => console.log(error),
        () => console.log('Get project complete'));
  }


  public getChart(id: number) {
    const searchCriteria = {
      projectId: id
    }

    this.appService.saveWithUrl('/service/project/getChart', searchCriteria)
      .subscribe((data: any[]) => {
        this.dashboard = data[0];
        // this.chartDataChange(this.tag, this.index);
        this.chartData = this.dashboard.dataSet[0];
        this.translate.get(['COMMON.BUDGET', 'COMMON.CONTRIBUTION', 'COMMON.EXPENSE']).subscribe(res => {
          this.chartData.data[0].label = res['COMMON.BUDGET'];
          this.chartData.data[1].label = res['COMMON.CONTRIBUTION'];
          this.chartData.data[2].label = res['COMMON.EXPENSE'];
        });

        console.log(this.chartData);

      },
        error => console.log(error),
        () => console.log('Get all getChart complete'));

  }

  chartClick($event) {
    this.tagValue = $event;
    // this.getSalesDtl();
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