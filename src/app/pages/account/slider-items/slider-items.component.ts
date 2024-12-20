import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Slider } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-slider-items',
  templateUrl: './slider-items.component.html',
  styleUrls: ['./slider-items.component.scss']
})
export class SliderItemsComponent implements OnInit {
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  slider: Slider = new Slider();
  menus = [{ name: 'SERVICES' }, { name: 'EXPERTISE' }];
  
  formData = new FormData();
  flag: any;
  sliderImages: any;
  messages = '';
  selectedTab = 1;
  selectedMainTabIndex = 1;
  icons: string[] = ['build', 'add', 'add_circle', 'cancel', 'trending_up', 'business',
    'school', 'record_voice_over', 'search', 'dashboard', 'radio', 'touch_app', 'movie',
    'person','people','addchart','extension','language','psychology','wb_sunny','highlight',
    'thumbs_up_down','share','public','science','self_improvement','model_training',
    'headset','hearing','headset_mic','biotech','miscellaneous_services','analytics'];

  constructor(public appService: AppService,
    private activatedRoute: ActivatedRoute,
    private translate: TranslateService) { }

  ngOnInit() {
    this.setLang();
    this.activatedRoute.params.subscribe(params => {
      if (params.id === 0) {
        this.slider = new Slider();
      } else {
        this.getSlider(params.id);
      }
    });
  }

  setLang() {
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
  }

  onMainTabChanged($event) {
    console.log('Selectd main = ' + this.selectedMainTabIndex);
    this.messages = '';
    if (this.selectedMainTabIndex === 1) {
      this.selectedTab = 0;
    }
  }


  getSlider(sliderId: number) {
    if (sliderId > 0)
      this.appService.getOne(sliderId, 'com.wack.model.website.Slider')
        .subscribe(result => {
          if (result.id > 0) {
            this.slider = result;
          } else {
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
              this.messages = res['MESSAGE.READ_FAILED'];
            });
          }
        });
  }

  clear() {
    this.slider = new Slider();
  }


  saveSlider() {
    this.messages = '';
    try {
      let nbFiles = 0;
      for (const img of this.sliderImages) {
        nbFiles++;
        this.formData.append('file[]', img.file, 'picture.jpg');
      }

      this.slider.status = (this.slider.status == null || this.slider.status.toString() === 'false') ? 0 : 1;
      
      if (this.sliderImages.length > 0) {
        this.appService.saveWithFile(this.slider, 'Slider', this.formData, 'saveWithFile')
          .subscribe(result => {
            if (result.id > 0) {
              console.log('saveWithFile');
              this.slider = result;
              this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_SUCCESS'];
              });
            } else {
              this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
              });
            }
          });
      } else {
        this.appService.save(this.slider, 'Slider')
          .subscribe(result => {
            if (result.id > 0) {
              this.slider = result;
              console.log('Saved');
              this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_SUCCESS'];
              });
            } else {
              this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
                this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
              });
            }
          });
      }

    } catch (e) {
      console.log(e);
    }
  }


}