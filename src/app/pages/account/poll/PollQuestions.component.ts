import { Component, OnInit, ViewChild, Input, ChangeDetectorRef } from '@angular/core';
import { Poll, PollQuestion, PollQuestionDesc, PositionDesc, PollChoice, PollChoiceDesc, User } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { AppSettings } from 'src/app/app.settings';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-pollquestion-component',
  templateUrl: './PollQuestions.component.html',
  styleUrls: ['./Polls.component.scss']
})
export class PollQuestionsComponent extends BaseComponent implements OnInit {

  messages = '';

  @Input() poll: Poll;
  pollQuestion: PollQuestion = new PollQuestion();
  pollQuestions: PollQuestion[] = [];

  pollQuestionDescs: PollQuestionDesc[] = [];

  activePositions: PositionDesc[];
  activeUsers: User[];
  selected = new FormControl(0);

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage) {
      super(translate, tokenStorage);
    }

  ngOnInit() {
    this.getDescriptions(undefined);
    this.getActivePositions();
    this.getActiveUsers();
  }


  public getActivePositions() {
    const parameters: string[] = [];
    parameters.push('e.language = |language|' + this.appService.getFlag().code + '|String');
    parameters.push('e.position.status = |status|1|Integer');
    this.appService.getAllByCriteriaWithFiles('PositionDesc', parameters).subscribe((data: PositionDesc[]) => {
      this.activePositions = data;
    });
  }

  public getActiveUsers() {
    const parameters: string[] = [];
    parameters.push('e.status = |status|1|Integer');
    this.appService.getAllByCriteriaWithFiles('User', parameters).subscribe((data: User[]) => {
      this.activeUsers = data;
    });
  }

  getPollQuestions() {

    this.appService.saveWithUrl('/service/poll/getPollQuestionDescs', {
          language: this.appService.getFlag().code,
          //status: 1,
          pollId: this.poll.id
        })
        .subscribe(data => {
          this.pollQuestionDescs = data;
        });
  }

  clearMessages($event) {
    this.messages = '';
  }

  setPoll($event) {
    this.poll = $event;
  }

  clear() {
    this.pollQuestion = new PollQuestion();
    this.pollQuestion.pollQuestionDescs = [];
    this.pollQuestion.pollChoices = [];
    this.pollQuestion.pollChoices.push(new PollChoice());
    for (const flag of this.appService.flags) {
      const pqd = new PollQuestionDesc();
      pqd.language = flag.code;
      pqd.description = '';
      this.pollQuestion.pollQuestionDescs.push(pqd);

      const pcd = new PollChoiceDesc();
      pcd.language = flag.code;
      pcd.description = '';
      this.pollQuestion.pollChoices[0].pollChoiceDescs.push(pcd);
    }
  }

  addChoice() {
    const pollChoice = new PollChoice();
    for (const flag of this.appService.flags) {
      const pcd = new PollChoiceDesc();
      pcd.language = flag.code;
      pcd.description = '';
      pollChoice.pollChoiceDescs.push(pcd);
    }


    this.pollQuestion.pollChoices.push(pollChoice);

  }


  getDescriptions(pollQuestionId: number) {
    this.messages = '';
    const parameters: string[] = [];
    if (pollQuestionId !== undefined) {
      parameters.push('e.pollQuestion.id = |pollQuestionId|' + pollQuestionId + '|Long');

      this.appService.getAllByCriteria('PollQuestionDesc', parameters)
        .subscribe((data: PollQuestionDesc[]) => {

          if (data !== null && data.length > 0) {
            this.pollQuestion = data[0].pollQuestion;
            this.pollQuestion.pollQuestionDescs = data;

            this.selected.setValue(1);

          }
        },
          error => console.log(error),
          () => console.log('Get all pollQuestion desc complete'));
    } else {
      this.clear();
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
      this.pollQuestion.poll = new Poll();
      this.pollQuestion.poll.id = this.poll.id;
      this.setToggles();
      const thisPollQuestion = {...this.pollQuestion};
      this.cleanDescriptions(thisPollQuestion);

      this.appService.save(thisPollQuestion, 'PollQuestion')
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.pollQuestion, null);
            this.pollQuestion = {...result};
            this.onSave(this.pollQuestion);
            this.selected.setValue(2);
            console.log(this.pollQuestion)
            this.clear();
          }
        });

    } catch (e) {
      console.log(e);
    }
  }


  edit(pollQuestionId: number) {
    this.messages = '';

    const parameters: string[] = [];
    this.appService.getOneWithChildsAndFiles(pollQuestionId, 'com.wack.poll.PollQuestion').subscribe((data: PollQuestion) => {
      this.pollQuestion = data
    });
 }


  cleanDescriptions(pq: PollQuestion) {
    pq.pollQuestionDescs.forEach(element => {
       element.pollQuestion = undefined;
    });
  }


  public remove(pqDesc: PollQuestionDesc) {
    this.messages = '';
    this.appService.delete(pqDesc.pollQuestion.id, 'PollQuestion')
      .subscribe(resp => {
        
      });
  }

  public applyFilter(filterValue: string) {
    // this.dataSource.filter = filterValue.trim().toLowerCase();
    // if (this.dataSource.paginator) {
    //   this.dataSource.paginator.firstPage();
    // }
  }


  onSave($event) {
    const pq = $event;

    this.appService.saveWithUrl('/service/poll/getPollQuestionDescs', {
      id: pq.id,
      language: this.appService.getFlag().code
    })
    .subscribe(data => {
      if (data && data.length > 0) {
        this.pollQuestionDescs.push(data[0]);
      }

    });
  }

  onToggleGroupChange(event) {
    this.pollQuestion.status = event.value;
  }
}
