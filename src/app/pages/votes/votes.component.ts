import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ActivatedRoute } from '@angular/router';
import { User, Poll, PollQuestion, PollChoice, Vote } from 'src/app/app.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-votes',
  templateUrl: './votes.component.html',
  styleUrls: ['./votes.component.scss']
})
export class VotesComponent implements OnInit, OnDestroy {
  public votes;
  public polls: Poll[];
  public pollQuestions: PollQuestion[] = [];
  public pollChoices: PollChoice[] = [];
  public pollQuestion: PollQuestion = new PollQuestion();
  public pollChoice: PollChoice = new PollChoice();
  public error = '';
  poll: Poll = new Poll();
  random = 0;
  pollIndex = 0;
  qIndex = 0;
  endNote: string;
  disabled = false;
  title: string;
  showMemberSearch = false;
  started = false;
  public user: User = new User();

  constructor(public appService: AppService,
    public translate: TranslateService,
    private route: ActivatedRoute) {

  }

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      console.log(params);
      this.getPoll(Number(params.get('id')));
    })
  }

  getPoll(id: number) {
    console.log('getting poll id=' + id);
    const parameters: string[] = [];
    parameters.push('e.id = |pid|' + id + '|Long');
    this.appService.getAllByCriteria('com.wack.poll.Poll', parameters, ' ')
      .subscribe((data: Poll[]) => {
        console.log(data);
        if (data.length > 0) {
          this.poll = data[0];
        }
      }, error => console.log(error),
        () => console.log('Get Section complete'));
  }

  startVote() {
    this.started = true;
    this.qIndex = 0;
    this.getPollQuestions(this.poll);
  }
  getNextQuestion() {
    console.log('Poll Index=' + this.pollIndex);
    console.log('Question index=' + this.qIndex);
    console.log('poll count=' + this.polls.length);
    console.log('number of Q=' + this.pollQuestions.length);
    if (this.qIndex === this.pollQuestions.length) {
      if (this.pollIndex >= this.polls.length) {
        this.poll = null;
      } else {
        this.poll = this.polls[this.pollIndex];
        /* this.endNote = this.poll.endNote;
        this.title = this.poll.title; */
        this.qIndex = 0;
        this.getPollQuestions(this.poll);
      }
    } else {
      this.pollQuestion = this.pollQuestions[this.qIndex++];
      this.getPollChoices(this.pollQuestion);
    }
  }


  getNextPoll() {
    if (this.pollIndex === this.polls.length) {
      this.poll = null;
    } else {
      this.poll = this.polls[this.pollIndex++];
    }
  }

  ngOnDestroy() {
    this.polls = null;
    this.error = null;
    this.poll = null;
  }

  vote(pc: PollChoice) {
    this.disabled = true;
    const vote: Vote = new Vote();
    vote.user = this.user;
    vote.pollChoice = pc;
    try {
      this.error = '';
      const index: number = this.pollChoices.findIndex((tb) => tb.id === pc.id);
      this.appService.vote(vote)
        .subscribe(result => {
          if (result.id > 0 && this.pollChoices.length > 2) {
            this.pollChoices.splice(index, 1);
          } else if (result.id > 0) {
            this.getNextQuestion();
            this.disabled = false;
          }
          else {
            this.translate.get(['MESSAGE.ERROR_OCCURRED', 'COMMON.ERROR']).subscribe(res => {
              this.error = res['MESSAGE.ERROR_OCCURRED'];
            });
            this.disabled = false;
          }
        })
    }
    catch (e) {
      console.log(e);
      this.disabled = false;
    }
    this.disabled = false;
  }

  removeFromTable() {
    this.polls.splice(this.findSelectedIndex(), 1);
    const onTheFly: Poll[] = [];
    onTheFly.push(...this.polls);
    this.polls = onTheFly;
  }


  findSelectedIndex(): number {
    return this.polls.indexOf(this.poll);
  }

  getPollQuestions(poll: Poll) {
    if (poll) {
      this.pollQuestions = [];
      // console.log('getPollQuestions: ' + poll.title);
      this.poll.userId = this.user.id;
      if(!this.user.id || (this.user.id>0)){
        this.poll.userId = 0;
      }
      this.appService.getPendingPollQuestions(poll)
        .subscribe(result => {
          console.log(result);
          this.pollQuestions = result;
          this.getPollChoices(this.pollQuestions[this.qIndex++]);
          this.pollQuestion = this.pollQuestions[0];
          this.pollIndex++;
          console.log('GOt Poll question');
          console.log(this.pollQuestion);
        },
          error => console.log(error),
          () => console.log('get pollQuestion complete'));
    }
  }

  getPollChoices(pq: PollQuestion) {
    const parameters: string[] = [];
    parameters.push('e.pollQuestion.id = |pqid|' + pq.id + '|Long');
    this.appService.getAllByCriteria('com.wack.poll.PollChoice', parameters, ' order by e.rank ')
      .subscribe((data: PollChoice[]) => {
        console.log('getPollChoices');
        console.log(data);
        this.pollChoices = data;
      }, error => console.log(error),
        () => console.log('Get Section complete'));
  }

}
