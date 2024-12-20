import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MediaChange, MediaObserver } from '@angular/flex-layout';
import { PerfectScrollbarConfigInterface } from 'ngx-perfect-scrollbar';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { PollQuestionDesc, Pagination, PollChoiceDesc, Vote, PollChoice, User } from 'src/app/app.models';
import { ActivatedRoute } from '@angular/router';
import { Settings, AppSettings } from 'src/app/app.settings';
import { AppService } from 'src/app/app.service';
import { TokenStorage } from 'src/app/token.storage';

@Component({
  selector: 'app-poll-question-details',
  templateUrl: './poll-question-details.component.html',
  styleUrls: ['./poll-question-details.component.scss']
})
export class PollQuestionDetailsComponent implements OnInit, OnDestroy {
  @ViewChild('sidenav') sidenav: any;
  public sidenavOpen = true;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  public psConfig: PerfectScrollbarConfigInterface = {
    wheelPropagation: true
  };
  pollQuestionDesc: PollQuestionDesc;
  pollChoiceDescs: PollChoiceDesc[];
  myVotes: Vote[];
  pollQuestionId: number;
  operation = 'scrutin';
  selectedVote: Vote;

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
    private activatedRoute: ActivatedRoute,
    protected tokenStorage: TokenStorage) {

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
      if (params.operation) {
        this.operation = params.operation;
      }

      if (Number(params.id) > 0) {
        this.pollQuestionId = params.id;
        this.getPollChoiceDescs(params.id);
      }
    });

  }

  ngOnDestroy() {
    this.watcher.unsubscribe();
  }

  getPollChoiceDescs(pollQuestionId: number) {
    const parameters: string[] = [];
    parameters.push('e.language = |language|' + this.lang + '|String');
    //parameters.push('e.pollQuestion.status = |stb|1|Integer');
    parameters.push('e.pollChoice.pollQuestion.id = |pollQuestionId|' + pollQuestionId + '|Long');
    this.appService.getAllByCriteriaWithFiles('com.wack.poll.PollChoiceDesc', parameters,
      this.operation === 'scrutin' ? ' order by e.pollChoice.pollQuestion.rank asc'
      : ' order by e.pollChoice.voteCounts desc')
      .subscribe((data: PollChoiceDesc[]) => {
        this.pollChoiceDescs = data;
        console.log(this.pollChoiceDescs);
        this.count = this.pollChoiceDescs.length;
        this.pagination = new Pagination(1, this.count, null, 2, this.count, 0);
        this.message = null;

        if (this.operation === 'scrutin') {
          this.getVotes(pollQuestionId);
        } else if (this.operation === 'results' && this.pollChoiceDescs.length > 0) {
          this.pollChoiceDescs[0].pollChoice.voted = true;
        }
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
    this.pollChoiceDescs.length = 0;
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

  performVote(pollChoiceId: number) {
    const vote = new Vote();
    vote.pollChoice = new PollChoice();
    vote.pollChoice.id = pollChoiceId;
    vote.user = new User();
    vote.user.id = +this.tokenStorage.getUserId();

    this.appService.saveWithUrl('/service/poll/vote/', vote)
      .subscribe(() => {

        this.getPollChoiceDescs(this.pollQuestionId);

      }, (error) => console.log(error),
        () => console.log('Perform vote complete'));
  }

  submitVote() {
    this.selectedVote.status = 5;

    this.appService.save(this.selectedVote, 'Vote')
      .subscribe(result => {
        this.getPollChoiceDescs(this.pollQuestionId);
      });
  }

  getVotes(pollQuestionId: number) {

    const parameters: string[] = [];
    parameters.push('e.pollChoice.pollQuestion.id = |pollQuestionId|' + pollQuestionId + '|Long');
    parameters.push('e.user.id = |userId|' + this.tokenStorage.getUserId() + '|Long');

    this.appService.getAllByCriteria('com.wack.poll.Vote', parameters,
      ' ').subscribe((data: Vote[]) => {
        this.myVotes = data;

        for (const pc of this.pollChoiceDescs) {
          for (const v of this.myVotes) {
            if (pc.pollChoice.id === v.pollChoice.id) {
              pc.pollChoice.voted = true;
              this.selectedVote = v;
            }
          }
        }
      });
  }


}