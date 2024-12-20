import { Component, OnInit, ViewChild, HostListener, ViewChildren, QueryList } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { AppService } from 'src/app/app.service';
import { News, ContactUsMessage } from 'src/app/app.models';
import { SwiperConfigInterface, SwiperDirective } from 'ngx-swiper-wrapper';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { AppSettings, Settings } from 'src/app/app.settings';
import { CompareOverviewComponent } from 'src/app/shared/compare-overview/compare-overview.component';
import { EmbedVideoService } from 'ngx-embed-video';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent extends BaseComponent implements OnInit {
  @ViewChild('sidenav') sidenav: any;
  @ViewChildren(SwiperDirective) swipers: QueryList<SwiperDirective>;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public sidenavOpen = true;
  public config: SwiperConfigInterface = {};
  public config2: SwiperConfigInterface = {};
  private sub: any;
  public news: News = new News();
  newsId=0;
  public settings: Settings;
  public embedNewsVideo: any;
  public relatedBlogs: News[];
  public featuredBlogs: News[];
  public contactForm: FormGroup;
  lang = 'fr';
  constructor(public appSettings: AppSettings,
    public appService: AppService,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    private activatedRoute: ActivatedRoute,
    private embedService: EmbedVideoService,
    public fb: FormBuilder) {
    super(translate, tokenStorage);
    this.settings = appService.appSettings.settings;
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
    this.getFeaturedBlogs();
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.newsId=params.id;
      this.getNews(params.id);
    });
    if (window.innerWidth < 960) {
      this.sidenavOpen = false;
      if (this.sidenav) {
        this.sidenav.close();
      }
    };
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: [''],
      message: ['', Validators.required]
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

  @HostListener('window:resize')
  public onWindowResize(): void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  public getPropertyById(id) {
    this.appService.getPropertyById(id).subscribe(data => {
      this.news = data;
      this.embedNewsVideo = this.embedService.embed(this.news.videos[1].link);
      setTimeout(() => {
        this.config.observer = true;
        this.config2.observer = true;
        this.swipers.forEach(swiper => {
          if (swiper) {
            swiper.setIndex(0);
          }
        });
      });
    });
  }

  getNews(newsId: number) {
    this.appService.getOneWithChildsAndFiles(newsId, 'com.wack.model.News')
      .subscribe(result => {
        if (result.id > 0) {
          this.news = result;
          // update the view count
          this.news.viewCount++;
          this.appService.save(this.news,'News').subscribe(result2 =>{
              // do nothing
          });

          if (this.news.videos.length > 0) {
            this.news.videos.forEach(video => {
              video.embedVideo = this.embedService.embed(video.link);
            });
          }
        }
      });
  }

  getFeaturedBlogs() {
    const parameters: string[] = [];
    parameters.push('e.language = |language|' + this.lang + '|String');
    parameters.push('e.status = |status|1|Integer');
    parameters.push('e.featured = |featured|1|Integer');
    this.appService.getAllByCriteriaWithFiles('com.wack.model.News', parameters).subscribe((data: News[]) => {
      this.featuredBlogs = data.slice(0, 3);
    });
  }

  ngAfterViewInit() {
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
    }

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
      // if (swiper.elementRef.nativeElement.id === 'main-carousel') {
      //   swiper.setIndex(index);
      // }
    });
  }

  public onIndexChange(index: number) {
    this.swipers.forEach(swiper => {
      // let elem = swiper.elementRef.nativeElement;
      // if (elem.id === 'small-carousel') {
      //   swiper.setIndex(index);
      //   for (let i = 0; i < elem.children[0].children.length; i++) {
      //     const element = elem.children[0].children[i];
      //     if (element.classList.contains('thumb-' + index)) {
      //       element.classList.add('active-thumb');
      //     }
      //     else {
      //       element.classList.remove('active-thumb');
      //     }
      //   }
      // }
    });
  } 

  public addToCompare() {
    this.appService.addToCompare(this.news, CompareOverviewComponent, (this.settings.rtl) ? 'rtl' : 'ltr');
  }

  public onCompare() {
    return this.appService.Data.compareList.filter(item => item.id === this.news.id)[0];
  }

  public addToFavorites() {
    this.appService.addToFavorites(this.news, (this.settings.rtl) ? 'rtl' : 'ltr');
  }

  public onFavorites() {
    return this.appService.Data.favorites.filter(item => item.id === this.news.id)[0];
  }

  public getRelatedProperties() {
    this.appService.getRelatedProperties().subscribe(properties => {
      this.relatedBlogs = properties;
    })
  }

  public onContactFormSubmit(values: any): void {
    this.messages = '';
    if (this.contactForm.valid) {
      const cmessage = new ContactUsMessage();
      cmessage.name = values.name;
      cmessage.email = values.email;
      cmessage.phone = values.phone;
      cmessage.news = this.news;
      cmessage.message = values.message;
      cmessage.modifiedBy = +this.tokenStorage.getUserId();
      this.appService.saveWithUrl('/service/ContactUsMessage/save', cmessage)
        .subscribe(data => {
          this.processResult(data, cmessage, null);
          if (data.errors === null || data.errors.length === 0) {
            this.contactForm.reset();
          }
        });
    }
  }
}