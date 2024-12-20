import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { News, User, Video, JobPositionDesc, JobPosition } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings, Settings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-position-component',
  templateUrl: './job-position.component.html',
  styleUrls: ['./job-position.component.scss']
})
export class JobPositionComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'published', 'views', 'actions'];
  dataSource: MatTableDataSource<JobPositionDesc>;
  public toolbarTypes = [1, 2];
  public headerTypes = ['default', 'image', 'carousel'];
  jobPosition: JobPosition = new JobPosition();
  messages: any;
  error: string;
  public flags = [
    { name: 'Francais', image: 'assets/images/flags/fr.svg', code: 'fr' },
    { name: 'English', image: 'assets/images/flags/gb.svg', code: 'en' }
  ];
  public flag: any;
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

  ngOnInit() {
    this.clear();
    this.activatedRoute.params.subscribe(params => {
      if (params.id === 0) {
        this.clear();
        this.flag = this.flags[0];
      } else {
        this.getDescriptions(params.id);
      }
    });
  }

  clearMessages() {
    this.messages = '';
  }

  setPosition($event) {
    this.jobPosition = $event;
  }

  clear() {
    this.jobPosition = new JobPosition();
    this.jobPosition.jobPositionDescs = [];
    for (const flag of this.appService.flags) {
      const jpd = new JobPositionDesc();
      jpd.language = flag.code;
      this.jobPosition.jobPositionDescs.push(jpd);
    }
  }

  getDescriptions(jobPositionId: number) {
    this.messages = '';

    this.appService.getOneWithChildsAndFiles(jobPositionId, 'com.wack.model.JobPosition')
      .subscribe(result => {
        if (result.id > 0) {
          console.log(result);
          this.jobPosition = result;
        }
      },
        error => console.log(error),
        () => console.log('Get all job position desc complete'));
  }

  setToggles() {
    this.jobPosition.status = (this.jobPosition.status == null
      || this.jobPosition.status.toString() === 'false'
      || this.jobPosition.status.toString() === '0') ? 0 : 1;
  }

  save() {
    this.messages = '';
    try {
      this.setToggles();
      const thisJobposition = { ...this.jobPosition };
      this.cleanDescriptions(thisJobposition);

      this.appService.save(thisJobposition, 'JobPosition')
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.jobPosition, null);
            this.jobPosition = { ...result };
            this.onSave(this.jobPosition);
            console.log(this.jobPosition)
            this.clear();
          }
        });

    } catch (e) {
      console.log(e);
    }
  }

  cleanDescriptions(jp: JobPosition) {
    jp.jobPositionDescs.forEach(element => {
      element.jobPosition = undefined;
    });
  }

  public remove(jpDesc: JobPositionDesc) {
    this.messages = '';
    this.appService.delete(jpDesc.jobPosition.id, 'JobPosition')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(jpDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<JobPositionDesc>(this.dataSource.data);
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
    const jobPos = $event;

    let i = 0;
    jobPos.jobPositionDescs.forEach(element => {
      if (element.language === this.appService.getFlag().code) {
        const jpdesc = { ...jobPos.jobPositionDescs[i] }
        jpdesc.jobPosition = jobPos;
        if (!this.dataSource.data) {
          this.dataSource.data = [];
        }
        this.updateDatasourceData(this.dataSource, this.paginator, this.sort, jpdesc);
      }
      i++;
    });
  }
}