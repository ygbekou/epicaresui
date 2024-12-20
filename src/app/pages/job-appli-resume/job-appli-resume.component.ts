import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { User, JobPositionDesc, JobAppli } from 'src/app/app.models';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings, Settings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-appli-resume-component',
  templateUrl: './job-appli-resume.component.html',
  styleUrls: ['./job-appli-resume.component.scss']
})
export class JobAppliResumeComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'published', 'views', 'actions'];
  dataSource: MatTableDataSource<JobPositionDesc>;
  public toolbarTypes = [1, 2];
  public headerTypes = ['default', 'image', 'carousel'];
  jobAppli: JobAppli = new JobAppli();
  jobPositionDesc: JobPositionDesc = new JobPositionDesc();
  jobPositionId: number;
  //messages: any;
  error: string;
  formData: FormData;
  files: any[];
  picture: any;
  action = 'submitting';

  public flags = [
    { name: 'Francais', image: 'assets/images/flags/fr.svg', code: 'fr' },
    { name: 'English', image: 'assets/images/flags/gb.svg', code: 'en' }
  ];
  public flag: any;

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    private activatedRoute: ActivatedRoute) {

    super(translate, tokenStorage);

  }

  ngOnInit() {
    this.clear();
    this.activatedRoute.params.subscribe(params => {
      if (Number(params.jobPositionDescId) > 0) {
        this.getJobPositionDesc(params.jobPositionDescId);
      }

      if (Number(params.id) === 0) {
        this.clear();
        this.flag = this.flags[0];
      } else {
        this.getJobAppli(params.id);
      }
    });
  }

  clearMessages() {
    this.messages = '';
  }

  clear() {
    this.jobAppli = new JobAppli();
  }


  getJobPositionDesc(jobPositionDescId: number) {
    this.messages = '';

    this.appService.getOneWithChildsAndFiles(jobPositionDescId, 'JobPositionDesc')
      .subscribe(result => {
        if (result.id > 0) {
          console.log(result);
          this.jobPositionDesc = result;
        }
      },
        error => console.log(error),
        () => console.log('Get all job position desc complete'));
  }

  getJobAppli(jobAppliId: number) {
    this.messages = '';

    this.appService.getOneWithChildsAndFiles(jobAppliId, 'JobAppli')
      .subscribe(result => {
        if (result.id > 0) {
          console.log(result);
          this.jobAppli = result;
        }
      },
        error => console.log(error),
        () => console.log('Get all job application complete'));
  }

  setToggles() {
    this.jobAppli.status = (this.jobAppli.status == null
      || this.jobAppli.status.toString() === 'false'
      || this.jobAppli.status.toString() === '0') ? 0 : 1;
  }

  save() {
    const userId = +this.tokenStorage.getUserId();
    if (userId > 0) {
      this.jobAppli.applicant = new User();
      this.jobAppli.modifiedBy = userId;
      this.jobAppli.applicant.id = userId;
    }
    this.jobAppli.jobPosition = this.jobPositionDesc.jobPosition;

    this.formData = new FormData();

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.files.length; i++) {
      //if (this.files[i].file) {
        this.formData.append('file[]', this.files[i], 'doc.' + this.files[i].name);
      //}
    }

    this.jobAppli.status = (this.jobAppli.status == null || this.jobAppli.status.toString() === 'false') ? 0 : 1;

    if (this.files.length > 0) {
      this.appService.saveWithFile(this.jobAppli, 'JobAppli', this.formData, 'saveWithFile')
        .subscribe(result => {
          this.processResultBasedOnId(result, this.jobAppli);
          this.action = 'success';
        });
    } else {
      this.appService.save(this.jobAppli, 'JobAppli')
        .subscribe(result => {
          this.processResultBasedOnId(result, this.jobAppli);
          this.action = 'success';
        });
    }
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


   onChange(event) {
        this.files = event.target.files;
    }
}