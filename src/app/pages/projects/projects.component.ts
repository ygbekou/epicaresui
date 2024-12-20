import { Component, OnInit, ViewChild, OnDestroy, Input } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Settings, AppSettings } from '../../app.settings';
import { AppService } from '../../app.service';
import { Project, Pagination, ProjectDesc } from '../../app.models';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TranslateService } from '@ngx-translate/core';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent extends BaseComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public projects: ProjectDesc[];
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort: string;
  public searchFields: any;
  public removedSearchField: string;
  public pagination: any;
  public message: string;
  public watcher: Subscription;

  @Input()
  fromPage: string;
  size: number;
  projectAll: ProjectDesc[];

  public settings: Settings


  constructor(public appSettings: AppSettings,
    public appService: AppService,
    protected translate: TranslateService,
    public tokenStorage: TokenStorage,
    public mediaObserver: MediaObserver) {

    super(translate, tokenStorage);
    this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
    this.settings = appService.appSettings.settings;
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
    this.getProjects();
  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  getProjects() {
    this.projects = [];
    const parameters: string[] = [];
    /* parameters.push('e.language = |language|' + this.lang + '|String');*/
    if (this.fromPage !== 'HomePage') {
      parameters.push('e.project.status IN |stb|1,5,10,90|ListI');
    } else {
      parameters.push('e.project.status IN |stb|5,10,90|ListI');
    }
    parameters.push('e.language = |lang|' + this.getLang() + '|String');

    this.appService.getAllByCriteriaWithFiles('com.wack.model.ProjectDesc', parameters,
      ' order by e.id asc').subscribe((data: ProjectDesc[]) => {
        this.projectAll = data;
        console.log(this.projectAll);

        this.size = (this.fromPage !== 'HomePage') ? this.projectAll.length : 4;

        let i = 0;
        for (const p of this.projectAll) {
          if (i < this.size) {
            this.projects.push(p);
          } else {
            break;
          }
          i++;
        }

        this.count = this.projects.length;
        this.pagination = new Pagination(1, this.count, null, 2, this.count, 0);
        if (this.projects.length === 0) {
          this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RECENT_PROJECT_FOUND']).subscribe(res => {
            this.message = res['MESSAGE.NO_RECENT_PROJECT_FOUND'];
          });
        }

      });
  }

  public getProject() {
    console.log('getProject called : ');
    console.log(this.projects);
    const result = this.filterData(this.projects);
    this.projects.length = 0;
    if (result.data.length === 0) {
      this.projects.length = 0;
      this.pagination = new Pagination(1, this.count, null, 2, 0, 0);
      this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
        this.message = res['MESSAGE.NO_RESULT_FOUND'];
      });
      return false;
    }
    this.projects = result.data;
    this.pagination = result.pagination;
    this.message = null;
  }

  public resetPagination() {
    if (this.paginator) {
      this.paginator.pageIndex = 0;
    }
    this.pagination = new Pagination(1, this.count, null, null, this.pagination.total, this.pagination.totalPages);
  }

  public filterData(data) {
    console.log(data);
    return this.appService.filterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);
  }

  public searchClicked(event) {
    if (event.search) {
      this.projects.length = 0;
      if (event.search === 'ALL') {
        console.log('Display all clicked');
        this.getProjects();
      } else {
        console.log('Search criteria=' + event.search);
        const parameters: string[] = [];
        // parameters.push('e.language = |language|' + this.lang + '|String');
        parameters.push('e.description like |content|' + '%' + event.search + '%' + '|String');
        parameters.push('e.language = |lang|' + this.getLang() + '|String');
        this.appService.getAllByCriteriaWithFiles('com.wack.model.ProjectDesc', parameters,
          ' order by e.createDate desc').subscribe((data: ProjectDesc[]) => {
            this.projects = data;
            this.count = this.projects.length;
            this.pagination = new Pagination(1, this.count, null, 2, this.count, 0);
            this.message = null;
            if (this.projects.length === 0) {
              this.translate.get(['COMMON.SAVE', 'MESSAGE.NO_RESULT_FOUND']).subscribe(res => {
                this.message = res['MESSAGE.NO_RESULT_FOUND'];
              });
            }
          });
      }
    }
    // window.scrollTo(0, 0);
  }

  public searchChanged(event) {
    event.valueChanges.subscribe(() => {
      this.resetPagination();
      this.searchFields = event.value;
      setTimeout(() => {
        this.removedSearchField = null;
      });
      if (!this.settings.searchOnBtnClick) {
        this.projects.length = 0;
      }
    });
    event.valueChanges.pipe(debounceTime(500), distinctUntilChanged()).subscribe(() => {
      if (!this.settings.searchOnBtnClick) {
        this.getProject();
      }
    });
  }

  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }

  public changeCount(count) {
    this.count = count;
    this.projects.length = 0;
    this.resetPagination();
    this.getProjects();
  }
  public changeSorting(sort) {
    this.sort = sort;
    this.getProjects();
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }

  public onPageChange(e) {
    this.pagination.page = e.pageIndex + 1;
    this.getProjects();
    window.scrollTo(0, 0);
  }

}