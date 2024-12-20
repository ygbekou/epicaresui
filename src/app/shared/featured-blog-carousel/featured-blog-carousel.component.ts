import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppService } from '../../app.service';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-featured-blog-carousel',
  templateUrl: './featured-blog-carousel.component.html',
  styleUrls: ['./featured-blog-carousel.component.scss']
})
export class FeaturedBlogCarouselComponent implements OnInit {
  public agents;
  @Input('blogs') featuredBlogs;
  public viewType: string = 'grid';
  public viewCol: number = 33.3;
  public config: SwiperConfigInterface = {};
  constructor(public appService: AppService) { }

  ngOnInit() {
    //this.agents = this.appService.getAgents();
  }

  // tslint:disable-next-line: use-lifecycle-interface
  ngAfterViewInit() {
    this.config = {
      observer: true,
      slidesPerView: 3,
      spaceBetween: 16,
      keyboard: true,
      navigation: true,
      pagination: false,
      grabCursor: true,
      loop: false,
      preloadImages: false,
      lazy: true,
      breakpoints: {
        600: {
          slidesPerView: 1,
        },
        960: {
          slidesPerView: 2,
        },
        1280: {
          slidesPerView: 3,
        }
      }
    }
  }

}
