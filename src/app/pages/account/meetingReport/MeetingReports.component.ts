import { Component, OnInit, ViewChild } from '@angular/core';
import { MeetingReport, MeetingReportDesc, User } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { AppSettings } from 'src/app/app.settings';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-mreport-component',
  templateUrl: './MeetingReports.component.html',
  styleUrls: ['./MeetingReports.component.scss']
})
export class MeetingReportsComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['meetingDate', 'title', 'author', 'status', 'actions'];
  dataSource: MatTableDataSource<MeetingReportDesc>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  meetingReport: MeetingReport = new MeetingReport();
  activeUsers: User[];
  selected = new FormControl(0);

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    private activatedRoute: ActivatedRoute) {
      super(translate, tokenStorage);
    }

  ngOnInit() {
    this.getAll();
    this.clear();
    this.getDescriptions(undefined);
    this.getActiveUsers();
  }

  public getActiveUsers() {
    const parameters: string[] = [];
    parameters.push('e.status = |uStat|1|Integer');
    this.appService.getAllByCriteriaWithFiles('User', parameters).subscribe((data: User[]) => {
      this.activeUsers = data;
    });
  }

  getAll() {
    const parameters: string[] = [];
    parameters.push('e.language = |langCode|' + this.appService.getFlag().code + '|String');
    this.appService.getAllByCriteria('MeetingReportDesc', parameters)
      .subscribe((data: MeetingReportDesc[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all MeetingReportDesc complete'));
  }

  clearMessages($event) {
    this.messages = '';
  }

  setMeetingReport($event) {
    this.meetingReport = $event;
  }

  clear() {
    this.meetingReport = new MeetingReport();
    this.meetingReport.meetingReportDescs = [];
    for (const flag of this.appService.flags) {
      const mrd = new MeetingReportDesc();
      mrd.language = flag.code;
      mrd.title = '';
      this.meetingReport.meetingReportDescs.push(mrd);
    }
  }

  getDescriptions(meetingReportId: number) {
    this.messages = '';
    const parameters: string[] = [];
    if (meetingReportId != null) {
      parameters.push('e.meetingReport.id = |meetingReportId|' + meetingReportId + '|Long');
    }
    this.appService.getAllByCriteria('MeetingReportDesc', parameters)
      .subscribe((data: MeetingReportDesc[]) => {

        if (data !== null && data.length > 0) {
          this.meetingReport = data[0].meetingReport;
          this.meetingReport.meetingReportDescs = data;

          this.selected.setValue(0);

        }
      },
        error => console.log(error),
        () => console.log('Get all meeting report desc complete'));
  }

  setToggles() {
    this.meetingReport.status = (this.meetingReport.status == null
      || this.meetingReport.status.toString() === 'false'
      || this.meetingReport.status.toString() === '0') ? 0 : 1;
  }

  save() {
    this.messages = '';
    try {
      this.setToggles();
      const thisMeetingReport = {...this.meetingReport};
      this.cleanDescriptions(thisMeetingReport);

      this.appService.save(thisMeetingReport, 'MeetingReport')
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.meetingReport, null);
            this.meetingReport = {...result};
            this.onSave(this.meetingReport);
            console.log(this.meetingReport)
            this.clear();
          }
        });

    } catch (e) {
      console.log(e);
    }
  }

  cleanDescriptions(mr: MeetingReport) {
    mr.meetingReportDescs.forEach(element => {
       element.meetingReport = undefined;
    });
  }


  public remove(mrDesc: MeetingReportDesc) {
    this.messages = '';
    this.appService.delete(mrDesc.meetingReport.id, 'MeetingReport')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(mrDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<MeetingReportDesc>(this.dataSource.data);
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
    const mReport = $event;

    let i = 0;
    mReport.meetingReportDescs.forEach(element => {
        if (element.language === this.appService.getFlag().code) {
          const mrdesc = {...mReport.meetingReportDescs[i]}
          mrdesc.meetingReport = mReport;
          if (!this.dataSource.data) {
            this.dataSource.data = [];
          }
          this.updateDatasourceData(this.dataSource, this.paginator, this.sort, mrdesc);
        }
        i++;
    });
  }
}
