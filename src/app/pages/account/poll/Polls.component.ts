import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { PollDesc, Poll, PollTypeDesc, PollQuestion } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { AppSettings } from 'src/app/app.settings';
import { TokenStorage } from 'src/app/token.storage';
import { FormControl } from '@angular/forms';
import { PollQuestionsComponent } from './PollQuestions.component';

@Component({
  selector: 'app-poll-component',
  templateUrl: './Polls.component.html',
  styleUrls: ['./Polls.component.scss']
})
export class PollsComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['pollTypeDescName', 'title', 'status', 'actions'];
  dataSource: MatTableDataSource<PollDesc>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  @ViewChild(PollQuestionsComponent, { static: false }) pollQuestionsView: PollQuestionsComponent;

  messages = '';
  poll: Poll;
  pollQuestion: PollQuestion = new PollQuestion();

  pollTypes: PollTypeDesc[];
  selected = new FormControl(0);

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    private changeDetectedRef: ChangeDetectorRef) {
      super(translate, tokenStorage);
    }

  ngOnInit() {
    this.getPolls();
    this.getDescriptions(undefined);
    this.getPollTypes();
  }

  public getPollTypes() {
    const parameters: string[] = [];
    parameters.push('e.language = |langCode|' + this.appService.getFlag().code + '|String');
    parameters.push('e.pollType.status = |uStat|1|Short');
    this.appService.getAllByCriteriaWithFiles('PollTypeDesc', parameters).subscribe((data: PollTypeDesc[]) => {
      this.pollTypes = data;
      console.log(this.pollTypes);
    });
  }

  getPolls() {

    this.appService.saveWithUrl('/service/poll/getPollDescs', {
      language: this.appService.getFlag().code,
      //status: 1
    })
        .subscribe(data => {
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;

          // if (data.errors === null || data.errors.length === 0) {
          //   //this.contactForm.reset();
          // }
        });
  }

  clearMessages($event) {
    this.messages = '';
  }

  setPoll($event) {
    this.poll = $event;
  }

  clear() {
    this.poll = new Poll();
    this.poll.pollDescs = [];
    for (const flag of this.appService.flags) {
      const pd = new PollDesc();
      pd.language = flag.code;
      pd.title = '';
      pd.description = '';
      pd.endNote = '';
      this.poll.pollDescs.push(pd);
    }
  }

  addNew() {
    this.clear();
    this.selected.setValue(1);
  }

  getDescriptions(pollId: number) {
    this.messages = '';
    const parameters: string[] = [];
    if (pollId) {
      parameters.push('e.poll.id = |pollId|' + pollId + '|Long');
      this.appService.getAllByCriteria('PollDesc', parameters)
      .subscribe((data: PollDesc[]) => {

        if (data !== null && data.length > 0) {
          this.poll = data[0].poll;
          this.poll.pollDescs = data;

          this.selected.setValue(1);

          this.changeDetectedRef.detectChanges();

          setTimeout(() => {
            this.pollQuestionsView.poll = this.poll;
            this.pollQuestionsView.getPollQuestions();
          }, 500);

        }
      },
        error => console.log(error),
        () => console.log('Get all poll desc complete'));
    }
  }

  setToggles() {
    this.poll.status = (this.poll.status == null
      || this.poll.status.toString() === 'false'
      || this.poll.status.toString() === '0') ? 0 : 1;
  }

  save() {
    this.messages = '';
    try {
      //this.setToggles();
      const thisPoll = {...this.poll};
      this.cleanDescriptions(thisPoll);

      this.appService.save(thisPoll, 'Poll')
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.poll, null);
            this.poll = {...result};
            this.onSave(this.poll);
            this.selected.setValue(2);
          }
        });

    } catch (e) {
      console.log(e);
    }
  }

  cleanDescriptions(p: Poll) {
    p.pollDescs.forEach(element => {
       element.poll = undefined;
    });
  }


  public remove(pDesc: PollDesc) {
    this.messages = '';
    this.appService.delete(pDesc.poll.id, 'Poll')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(pDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<PollDesc>(this.dataSource.data);
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        } else if (resp.result === 'FOREIGN_KEY_FAILURE') {
          this.translate.get(['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY', 'COMMON.ERROR']).subscribe(res => {
            this.messages = res['MESSAGE.DELETE_UNSUCCESS_FOREIGN_KEY'];
          });
        } else {
          this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
            this.messages = res['MESSAGE.ERROR_OCCURRED'];
          });
        }
      });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  onSave($event) {
    const p = $event;

    this.appService.saveWithUrl('/service/poll/getPollDescs', {
      id: p.id,
      language: this.appService.getFlag().code
    })
    .subscribe(data => {
      this.updateDatasourceData(this.dataSource, this.paginator, this.sort, data[0]);
      this.selected.setValue(2);
    });
  }


  onToggleGroupChange(event) {
    this.poll.status = event.value;
  }

}
