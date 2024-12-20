import { Component, OnInit, Input } from '@angular/core';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';
import { AppService } from 'src/app/app.service';
import { User } from 'src/app/app.models';

@Component({
  selector: 'app-our-leadership',
  templateUrl: './our-leadership.component.html',
  styleUrls: ['./our-leadership.component.scss']
})
export class OurLeadershipComponent implements OnInit {
  users: User[];
  userAll: User[];
  public config: SwiperConfigInterface = {};
  @Input()
  fromPage: string;
  size: number;


  constructor(public appService: AppService) { }

  ngOnInit() {
    this.getAll();
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
            } else {
              break;
            }
            i++;
          }
        }
      }, error => console.log(error),
        () => console.log('Get Leadership complete'));
  }

}
