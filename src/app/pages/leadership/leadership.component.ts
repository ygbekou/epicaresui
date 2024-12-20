import { Component, OnInit, AfterViewInit, Input } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { User, Section, SectionItem } from 'src/app/app.models';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-leadership-component',
  templateUrl: './leadership.component.html'
})
export class LeadershipComponent extends BaseComponent implements OnInit, AfterViewInit {


  users: User[];
  userAll: User[];
  public config: SwiperConfigInterface = {};
  @Input()
  fromPage: string;
  size: number;

  section: Section;

  constructor(public appService: AppService,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage) {

    super(translate, tokenStorage);
  }

  ngOnInit() {
    this.getAll();
    this.getAboutUs();
  }

  ngAfterViewInit() {
    this.config = {
      observer: true,
      slidesPerView: 4,
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


  getAll() {
    this.users = [];
    const parameters: string[] = [];
    parameters.push('e.status = |status|1|Integer');
    parameters.push('e.position.leadership = |leader|1|Integer');
    this.appService.getAllByCriteria('User', parameters, ' ORDER BY e.position.rank ')
      .subscribe((data: User[]) => {
        console.log(data);
        if (data.length > 0) {
          this.userAll = data;

          this.size = (this.fromPage !== 'HomePage') ? this.userAll.length : 4;

          let i = 0;
          for (const u of this.userAll) {
            if (i < this.size) {
              this.users.push(u);
              for (const ps of this.appService.positionDescs) {
                if (u.position.id === ps.position.id) {
                  u.position.name = ps.name;
                  break;
                }
              }

              if (u.userDescs) {
                for (const ud of u.userDescs) {
                  if (ud.language === this.getLang()) {
                    u.shortResume = ud.shortResume;
                    u.resume = ud.resume;
                  }
                }
              }
            } else {
              break;
            }
            i++;
          }
        }
      }, error => console.log(error),
        () => console.log('Get Leadership complete'));
  }

  getAboutUs() {
    const parameters: string[] = [];
    parameters.push('e.name = |name|ABOUT_US|String');
    parameters.push('e.language = |language|' + this.getLang() + '|String');
    parameters.push('e.status = |status|1|Integer');
    this.appService.getAllByCriteria('com.wack.model.website.Section', parameters)
      .subscribe((data: Section[]) => {
        if (data.length > 0) {
          this.section = data[0];
        }
      }, error => console.log(error),
        () => console.log('Get Section complete'));
  }

}