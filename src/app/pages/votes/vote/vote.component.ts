import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { AppService } from 'src/app/app.service';
import { Settings, AppSettings } from 'src/app/app.settings';
import { News, Pagination, User } from 'src/app/app.models';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { TranslateService } from '@ngx-translate/core';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Component({
  selector: 'app-vote',
  templateUrl: './vote.component.html',
  styleUrls: ['./vote.component.scss']
})
export class VoteComponent implements OnInit {
  private sub: any;
  public vote: User = new User();
  public voteId: number;
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen: boolean = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  error = '';
  lang = 'fr';
  public blogs: News[];
  public viewType: string = 'grid';
  public viewCol: number = 33.3;
  public count: number = 12;
  public sort: string;
  public searchFields: any;
  public removedSearchField: string;
  public pagination: Pagination = new Pagination(1, this.count, null, 2, 0, 0);
  public message: string;
  public watcher: Subscription;
  public settings: Settings
  public contactForm: FormGroup;

  constructor(public appSettings: AppSettings,
    public appService: AppService,
    private translate: TranslateService,
    private activatedRoute: ActivatedRoute,
    public mediaObserver: MediaObserver,
    public fb: FormBuilder) {
    this.settings = appService.appSettings.settings;
    this.watcher = mediaObserver.media$.subscribe((change: MediaChange) => {
      if (change.mqAlias == 'xs') {
        this.sidenavOpen = false;
        this.viewCol = 100;
      }
      else if (change.mqAlias == 'sm') {
        this.sidenavOpen = false;
        this.viewCol = 50;
      }
      else if (change.mqAlias == 'md') {
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
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.voteId = params['id'];
      this.getUser(params['id']);
    });

    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });

  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.watcher.unsubscribe();
  }

  getUser(userId: number) {
    if (userId === 0) {
      this.vote = new User();
    }

    if (userId > 0)
      this.appService.getOneWithChildsAndFiles(userId, 'User')
        .subscribe(result => {
          if (result.id > 0) {
            this.vote = result;
            this.getArticles(this.vote.id);
            if (this.vote.employees.length > 0) {
              this.vote.shortResume = this.vote.employees[0].shortResume;
              this.vote.resume = this.vote.employees[0].resume;
            }

          } else {
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {

              this.error = res['MESSAGE.READ_FAILED'];

            });
          }
        });
  }

  public getVoteById(id) {
    // this.vote = this.appService.getVotes().filter(vote => vote.id == id)[0];
  }


  public getArticles(id: number) {
    const parameters: string[] = [];
    parameters.push('e.language = |language|' + this.lang + '|String');
    parameters.push('e.status = |status|1|Integer');
    parameters.push('e.author.id = |authorId|' + id + '|Long');
    this.appService.getAllByCriteriaWithFiles('com.wack.model.News', parameters).subscribe((data: News[]) => {
      this.blogs = data;
      this.count = this.blogs.length;
      this.pagination = new Pagination(1, this.count, null, 2, this.count, 0);
      this.message = null;
    });

  }

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
  }

  public filterData(data) {
    return this.appService.filterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);
  }

  public searchClicked() {
    this.blogs.length = 0;
    this.getArticles(this.voteId);
    window.scrollTo(0, 0);
  }
  public searchChanged(event) {
    event.valueChanges.subscribe(() => {
      this.resetPagination();
      this.searchFields = event.value;
      setTimeout(() => {
        this.removedSearchField = null;
      });
      if (!this.settings.searchOnBtnClick) {
        this.blogs.length = 0;
      }
    });
    event.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      if (!this.settings.searchOnBtnClick) {
        this.getArticles(this.voteId);
      }
    });
  }
  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }


  public changeCount(count) {
    this.count = count;
    this.blogs.length = 0;
    this.resetPagination();
    this.getArticles(this.voteId);
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.blogs.length = 0;
    this.getArticles(this.voteId);
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }


  public onPageChange(e) {
    this.pagination.page = e.pageIndex + 1;
    this.getArticles(this.voteId);
    window.scrollTo(0, 0);
  }

  public onContactFormSubmit(values: Object) {
    if (this.contactForm.valid) {
      console.log(values);
    }
  }

}