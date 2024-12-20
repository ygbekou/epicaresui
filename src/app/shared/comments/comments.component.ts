import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from 'src/app/theme/utils/app-validators';
import { AppService } from 'src/app/app.service';
import { Comment, News, Project } from 'src/app/app.models';
import { TokenStorage } from 'src/app/token.storage';
import { BaseComponent } from '../baseComponent';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-comments',
  templateUrl: './comments.component.html',
  styleUrls: ['./comments.component.scss']
})
export class CommentsComponent extends BaseComponent implements OnInit {
  @Input('newsId') newsId;
  @Input('projectId') projectId;
  public commentForm: FormGroup;
  reviews: Comment[] = [];
  news: News = new News();
  project: Project = new Project();
  public ratings = [
    { title: 'Tres insatisfait', icon: 'sentiment_very_dissatisfied', percentage: 20, selected: false },
    { title: 'Insatisfait', icon: 'sentiment_dissatisfied', percentage: 40, selected: false },
    { title: 'Neutre', icon: 'sentiment_neutral', percentage: 60, selected: false },
    { title: 'Satisfait', icon: 'sentiment_satisfied', percentage: 80, selected: false },
    { title: 'Tres satisfait', icon: 'sentiment_very_satisfied', percentage: 100, selected: false }
  ];
  constructor(translate: TranslateService, public fb: FormBuilder, private appService: AppService, tokenStorage: TokenStorage) {
    super(translate, tokenStorage);
  }

  ngOnInit() {
    this.commentForm = this.fb.group({
      review: [null, Validators.required],
      name: [null, Validators.compose([Validators.required, Validators.minLength(4)])],
      email: [null, Validators.compose([Validators.required, emailValidator])],
      rate: null,
      newsId: this.newsId,
      projectId: this.projectId
    });

    this.getComments(this.newsId, this.projectId);
    this.getNews(this.newsId, this.projectId);
  }

  getComments(newsId: number, projectId: number) {
    const parameters: string[] = [];
    if (newsId > 0) {
      parameters.push('e.news.id = |newsId|' + newsId + '|Long');
    } else if (projectId > 0) {
      parameters.push('e.project.id = |pid|' + projectId + '|Long');
    }
    if (parameters.length > 0) {
      this.appService.getAllByCriteria('com.wack.model.website.Comment', parameters)
        .subscribe((data: Comment[]) => {
          this.reviews = data;
        },
          error => console.log(error),
          () => console.log('Get all Comments complete'));
    }
  }

  getNews(newsId: number, projectId: number) {
    console.log('Getting news:' + newsId);
    if (newsId > 0) {
      this.appService.getOne(newsId, 'com.wack.model.News')
        .subscribe(result => {
          if (result.id > 0) {
            this.news = result;
          }
        });
    } else if (projectId > 0) {
      this.appService.getOne(projectId, 'com.wack.model.Project')
        .subscribe(result => {
          if (result.id > 0) {
            this.project = result;
          }
        });
    }

  }

  public onCommentFormSubmit(values: any) {
    if (this.commentForm.valid) {
      console.log(values);
      this.messages = null;
      const review: Comment = new Comment();
      review.author = values.name;
      review.authorEmail = values.email;
      review.message = values.review;
      review.rating = values.rate;
      if (this.news && this.news.id > 0) {
        review.news = this.news;
      }
      if (this.project && this.project.id > 0) {
        review.project = this.project;
      }
      review.modifiedBy = 0;
      this.appService.save(review, 'Comment')
        .subscribe(data => {
          this.processResult(data, review, null);
          if (data.errors === null || data.errors.length === 0) {
            this.reviews.push(data);
            this.processResult(data, review, null);
            if (data.errors === null || data.errors.length === 0) {
              this.commentForm.reset();
            }
          }
        });
    }
  }

  public rate(rating: any) {
    this.ratings.filter(r => r.selected = false);
    this.ratings.filter(r => r.percentage === rating.percentage)[0].selected = true;
    this.commentForm.controls.rate.setValue(rating.percentage);
    if (this.newsId > 0) {
      this.news.ratingCount++;
      this.news.rating = this.news.rating + this.commentForm.controls.rate.value;
      this.appService.save(this.news, 'News')
        .subscribe(data2 => {
          // nothing to do
          console.log('Rating saved : rating= ' + this.news.rating + ', Rate count=' + this.news.ratingCount);
        });
    } else if (this.projectId > 0) {
      this.project.ratingCount++;
      this.project.rating = this.project.rating + this.commentForm.controls.rate.value;
      this.appService.save(this.project, 'Project')
        .subscribe(data2 => {
          // nothing to do
          console.log('Rating saved : rating= ' + this.project.rating + ', Rate count=' + this.project.ratingCount);
        });
    }

  }

}