/// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { AppService } from 'src/app/app.service';
import { User, Video } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AppSettings } from 'src/app/app.settings';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { BaseComponent } from 'src/app/shared/baseComponent';

@Component({
  selector: 'app-submit-resume',
  templateUrl: './submit-resume.component.html',
  styleUrls: ['./submit-resume.component.scss']
})
export class SubmitResumeComponent extends BaseComponent implements OnInit {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  @ViewChild('addressAutocomplete') addressAutocomplete: ElementRef;
  public toolbarTypes = [1, 2];
  public headerTypes = ['default', 'image', 'carousel'];
  public flags = [
    { name: 'Francais', image: 'assets/images/flags/fr.svg', code: 'fr' },
    { name: 'English', image: 'assets/images/flags/gb.svg', code: 'en' }
  ];

  public flag: any;
  messages: any;
  error: string;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  formData: FormData;
  files: any[];
  user: User = new User();
  picture: any;
  news: any;
  done = false;

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    public translate: TranslateService,
    public tokenStorage: TokenStorage,
    private activatedRoute: ActivatedRoute) {

    super(translate, tokenStorage);

  }

  public changeLang(flag) {
    this.flag = flag;
    if (this.user === null) {
      this.clear();
    }
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
    if (lang === 'fr') {
      this.flag = this.flags[0];
    } else {
      this.flag = this.flags[1];
    }

    this.activatedRoute.params.subscribe(params => {
      if (params.id === '0') {
        this.getResume(Number(this.tokenStorage.getUserId()));
      } else {
        this.getResume(params.id);
      }
    });
  }

  public addVideo(): void {
    if (!this.user.videos) {
      this.user.videos = [];
    }
    this.user.videos.push(new Video());
  }

  public deleteVideo(id: number, index: number) {

    if (id === undefined || id === null) {
      this.removeItem(this.user.videos, id);
      return;
    }

    this.appService.delete(id, 'com.wack.model.Video')
      .subscribe(data => {
        this.removeItem(this.user.videos, id);
        this.processDeleteResult(data, this.messages);
      });
  }

  getResume(userId: number) {
    this.appService.getOneWithChildsAndFiles(userId, 'User')
      .subscribe(result => {
        if (result.id > 0) {
          this.user = result;
          console.log(this.user);
          const images: any[] = [];
          this.user.fileNames.forEach(item => {
            const image = {
              link: 'assets/images/users/' + this.user.id + '/' + item,
              preview: 'assets/images/users/' + this.user.id + '/' + item
            }
            images.push(image);
          })
          this.files = images;
        } else {
          this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
            this.messages = res['MESSAGE.READ_FAILED'];
          });
        }
      });
  }

  save() {
    this.messages = '';
    this.error = '';
    let almostDone = false;
    console.log(this.user);
    console.log('Selected index = '+ this.horizontalStepper.selectedIndex);
    if (this.horizontalStepper.selectedIndex < 1) {
      if (this.horizontalStepper.selectedIndex === 0) {
        if (!this.user.resume) {
          this.translate.get(['VALIDATION.FILL_FIELD_MARKED', 'COMMON.ERROR']).subscribe(res => {
            this.error = res['VALIDATION.FILL_FIELD_MARKED'];
          });
        } else {
          this.horizontalStepper.selectedIndex++;
        }
      }
    } else {
      almostDone = true;
    }
    console.log(this.error);
    if (!this.error) {
      console.log('Passed ' + this.error);
      this.user.modifiedBy = +this.tokenStorage.getUserId();

      this.formData = new FormData();
      this.user.remainingFileNames = [];
      // tslint:disable-next-line: prefer-for-of
      for (let i = 0; i < this.files.length; i++) {
        if (this.files[i].file) {
          console.log('Additional file added: ' + 'picture.' + this.files[i].file.name);
          this.formData.append('file[]', this.files[i].file, 'picture.' + this.files[i].file.name);
        } else {
          console.log(this.files[i]);
          const pathSplitArray = this.files[i].link.split('/');
          this.user.remainingFileNames.push(pathSplitArray[pathSplitArray.length - 1]);
        }
      }
      if (this.files.length > 0) {
        this.appService.saveWithFile(this.user, 'User', this.formData, 'saveWithFile')
          .subscribe(result => {
            if (result.id > 0) {
              console.log('saveWithFile');
              this.user = result;
              console.log('Index = ' + this.horizontalStepper.selectedIndex);
              if (almostDone) {
                this.done = true;
              } else {
                this.translate.get(['MESSAGE.DATA_SAVED', 'COMMON.SUCCESS']).subscribe(res => {
                  this.messages = res['MESSAGE.DATA_SAVED'];
                });
              }
            } else {
              this.translate.get(['MESSAGE.DATA_SAVED_FAILED', 'COMMON.ERROR']).subscribe(res => {
                this.error = res['MESSAGE.DATA_SAVED_FAILED'];
              });
            }
          });
      } else {
        this.appService.save(this.user, 'User')
          .subscribe(result => {
            if (result.id > 0) {
              this.user = result;
              console.log('Saved');
              console.log('Index = ' + this.horizontalStepper.selectedIndex);
              if (almostDone) {
                this.done = true;
              } else {
                this.translate.get(['MESSAGE.DATA_SAVED', 'COMMON.SUCCESS']).subscribe(res => {
                  this.messages = res['MESSAGE.DATA_SAVED'];
                });
              }
            } else {
              this.translate.get(['MESSAGE.DATA_SAVED_FAILED', 'COMMON.ERROR']).subscribe(res => {
                this.error = res['MESSAGE.DATA_SAVED_FAILED'];
              });
            }
          });
      }
    }
  }

  canEdit() {
    return this.tokenStorage.hasToken();
    /* && ( this.resume &&
    (!(this.resume.id >0)|| (this.resume.id >0 && this.resume.status === 0 &&
    Number(this.tokenStorage.getUserId()) === this.resume.user.id))); */
  }
  isAdmin() {
    return this.tokenStorage.hasToken() &&
      this.tokenStorage.getRole() !== '30'
  }

  clear() {
    // this.resume = new Resume();
  }

  onSelectionChange($event) {

  }
}