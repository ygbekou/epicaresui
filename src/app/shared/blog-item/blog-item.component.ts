import { Component, OnInit, Input, ViewChild, SimpleChange } from '@angular/core';
import { SwiperDirective, SwiperConfigInterface, SwiperPaginationInterface } from 'ngx-swiper-wrapper';
import { News, User } from '../../app.models';
import { Settings, AppSettings } from '../../app.settings';

import { AppService } from '../../app.service';
import { CompareOverviewComponent } from '../compare-overview/compare-overview.component';

@Component({
  selector: 'app-blog-item',
  templateUrl: './blog-item.component.html',
  styleUrls: ['./blog-item.component.scss']
})
export class BlogItemComponent implements OnInit {
  @Input() news: News=new News();
  @Input() viewType = 'grid';
  @Input() viewColChanged = false;
  @Input() fullWidthPage = true;
  public column = 4;
  // public address:string;
  @ViewChild(SwiperDirective) directiveRef: SwiperDirective;
  public config: SwiperConfigInterface = {};
  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true
  };
  public settings: Settings;
  constructor(public appSettings:AppSettings, public appService:AppService) {
    this.settings = appService.appSettings.settings;
  }

  ngOnInit() { }

  ngAfterViewInit(){
    this.initCarousel();
  }

  ngOnChanges(changes: {[propKey: string]: SimpleChange}){
    if(changes.viewColChanged){
      this.getColumnCount(changes.viewColChanged.currentValue);
      if(!changes.viewColChanged.isFirstChange()){
        if(this.news.gallery.length > 1){
           this.directiveRef.update();
        }
      }
    }

  }

  public getColumnCount(value){
    if(value === 25){
      this.column = 4;
    }
    else if(value === 33.3){
      this.column = 3;
    }
    else if(value === 50){
      this.column = 2
    }
    else{
      this.column = 1;
    }
  }

  public getStatusBgColor(status){
    switch (status) {
      case 'For Sale':
        return '#558B2F';
      case 'For Rent':
        return '#1E88E5';
      case 'Open House':
        return '#009688';
      case 'No Fees':
        return '#FFA000';
      case 'Hot Offer':
        return '#F44336';
      case 'Sold':
        return '#000';
      default:
        return '#01579B';
    }
  }


  public initCarousel(){
    this.config = {
      slidesPerView: 1,
      spaceBetween: 0,
      keyboard: false,
      navigation: true,
      pagination: this.pagination,
      grabCursor: true,
      loop: true,
      preloadImages: false,
      lazy: true,
      nested: true,
      // autoplay: {
      //   delay: 5000,
      //   disableOnInteraction: false
      // },
      speed: 500,
      effect: 'slide'
    }
  }


  public addToCompare(){
    this.appService.addToCompare(this.news, CompareOverviewComponent, (this.settings.rtl) ? 'rtl':'ltr');
  }

  public onCompare(){
    return this.appService.Data.compareList.filter(item=>item.id === this.news.id)[0];
  }

  public addToFavorites(){
    this.appService.addToFavorites(this.news, (this.settings.rtl) ? 'rtl':'ltr');
  }

  public onFavorites(){
    return this.appService.Data.favorites.filter(item=>item.id === this.news.id)[0];
  }


}
