import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { News, User, Video } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings, Settings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-news-component',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss']
})
export class NewsComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'published', 'views', 'actions'];
  dataSource: MatTableDataSource<News>;
  public toolbarTypes = [1, 2];
  public headerTypes = ['default', 'image', 'carousel'];
  news: News = new News();
  newss: News[] = [];
  messages: any;
  error: string;
  public flags = [
    { name: 'Francais', image: 'assets/images/flags/fr.svg', code: 'fr' },
    { name: 'English', image: 'assets/images/flags/gb.svg', code: 'en' }
  ];
  public flag : any;
  public settings: Settings;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  formData: FormData;
  files: any[];
  picture: any;

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    private activatedRoute: ActivatedRoute) {

    super(translate, tokenStorage);

  }

  public changeLang(flag) {
    this.flag = flag;
    if (this.news === null) {
      this.clear();
    } else {
      this.news.language = flag.code;
    }
  }

  public addNewsVideo(): void {
    if(!this.news.videos){
      this.news.videos =[];
    }
    this.news.videos.push(new Video());
  }

  public deleteNewsVideo(id: number, index: number) {

    if (id === undefined || id === null) {
      this.removeItem(this.news.videos, id);
      return;
    }

    this.appService.delete(id, 'com.wack.model.Video')
      .subscribe(data => {
        this.removeItem(this.news.videos, id);
        this.processDeleteResult(data, this.messages);
      });
  }

  public deleteFile(news: News, fileName: string) {
    const vo = { id: news.id, name: fileName };
    this.appService.deleteFile('com.wack.model.News', vo)
      .subscribe(data => {
        this.removeElement(this.news.fileNames, fileName);
      });
  }


  ngOnInit() {
    const lang = this.appService.getFlag();
    this.activatedRoute.params.subscribe(params => {
      if (params.id === 0) {
        this.clear();
        this.flag = this.flags[0];
      } else {
        this.getNews(params.id);
      }
    });
  }


  getNews(newsId: number) {
    this.appService.getOneWithChildsAndFiles(newsId, 'com.wack.model.News')
      .subscribe(result => {
        if (result.id > 0) {
          this.news = result;
          console.log(result);
          const images: any[] = [];
          if(this.news.language==='fr'){
            this.flag = this.flags[0];
          }else{
            this.flag = this.flags[1];
          }
          console.log(this.news);
          this.news.fileNames.forEach(item => {
            const image = {
              link: 'assets/images/news/' + newsId + '/' + item,
              preview: 'assets/images/news/' + newsId + '/' + item
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
    this.news.author = new User();
    this.news.modifiedBy = +this.tokenStorage.getUserId();
    this.news.author.id = +this.tokenStorage.getUserId();
    this.formData = new FormData();

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.files.length; i++) {
      if (this.files[i].file) {
        this.formData.append('file[]', this.files[i].file, 'picture.' + this.files[i].file.name);
      }
    }

    this.news.status = (this.news.status == null || this.news.status.toString() === 'false') ? 0 : 1;
    this.news.featured = (this.news.featured == null || this.news.featured.toString() === 'false') ? 0 : 1;
    if (this.files.length > 0) {
      this.appService.saveWithFile(this.news, 'News', this.formData, 'saveWithFile')
        .subscribe(result => {
          if (result.id > 0) {
            console.log('saveWithFile');
            this.news = result;
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
      this.appService.save(this.news, 'News')
        .subscribe(result => {
          if (result.id > 0) {
            this.news = result;
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
  }

  clear() {
    this.news = new News();
    this.news.author = new User();
    this.news.author.id = +this.tokenStorage.getUserId();
    this.news.language = this.flag.code;
    this.news.fileNames = [];
    this.news.videos = [];
  }

}