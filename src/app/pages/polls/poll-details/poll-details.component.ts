import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PollQuestionDesc, PollDesc, Pagination } from 'src/app/app.models';
import { ActivatedRoute } from '@angular/router';
import { Settings, AppSettings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';

@Component({
  selector: 'app-poll-details',
  templateUrl: './poll-details.component.html',
  styleUrls: ['./poll-details.component.scss']
})
export class PollDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  public pollDesc: PollDesc;
  public pollQuestionDescs: PollQuestionDesc[];
  public viewType = 'grid';
  public viewCol = 33.3;
  public count = 12;
  public sort: string;
  public searchFields: any;
  public removedSearchField: string;
  public pagination: any;
  public message: string;
  public watcher: Subscription;
  lang = 'fr';

  public settings: Settings

  constructor(public appSettings: AppSettings,
    public appService: AppService,
    protected translate: TranslateService,
    public mediaObserver: MediaObserver,
    private activatedRoute: ActivatedRoute) {

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
    this.activatedRoute.params.subscribe(params => {
      if (Number(params.id) > 0) {
        this.getPollQuestionDescs(params.id);
      }
    });

  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  getPollQuestionDescs(pollId: number) {
    console.log('Getting Poll Poll Questions ...')
    const parameters: string[] = [];
    parameters.push('e.language = |language|' + this.lang + '|String');
    //parameters.push('e.pollQuestion.status = |stb|1|Integer');
    parameters.push('e.pollQuestion.poll.id = |pollId|' + pollId + '|Long');
    this.appService.getAllByCriteriaWithFiles('com.wack.poll.PollQuestionDesc', parameters,
      ' order by e.pollQuestion.rank asc').subscribe((data: PollQuestionDesc[]) => {
        this.pollQuestionDescs = data;
        console.log(this.pollQuestionDescs);
        this.count = this.pollQuestionDescs.length;
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
    console.log(data);
    return this.appService.filterData(data, this.searchFields, this.sort, this.pagination.page, this.pagination.perPage);
  }



  public removeSearchField(field) {
    this.message = null;
    this.removedSearchField = field;
  }

  public changeCount(count) {
    this.count = count;
    this.pollQuestionDescs.length = 0;
    this.resetPagination();
  }
  public changeSorting(sort) {
    this.sort = sort;
  }
  public changeViewType(obj) {
    this.viewType = obj.viewType;
    this.viewCol = obj.viewCol;
  }

  public onPageChange(e) {
    this.pagination.page = e.pageIndex + 1;
    window.scrollTo(0, 0);
  }

}