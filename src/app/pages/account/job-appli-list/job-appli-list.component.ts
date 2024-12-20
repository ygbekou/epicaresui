import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { JobPositionDesc, JobAppli } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/token.storage';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-job-appli-list',
  templateUrl: './job-appli-list.component.html',
  styleUrls: ['./job-appli-list.component.scss']
})
export class JobAppliListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'phone', 'email', 'createDatetime', 'status', 'actions'];
  dataSource: MatTableDataSource<JobAppli>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages: any;

  constructor(public appService: AppService,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    private activatedRoute: ActivatedRoute) {

    super(translate, tokenStorage);
  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      if (Number(params.jobPositionId) > 0) {
        this.getJobApplis(params.jobPositionId);
      }
    });

  }

  public getJobApplis(jobPositionId: number) {
    const parameters: string[] = [];
    if (jobPositionId > 0) { 
      parameters.push('e.jobPosition.id = |jobPositionId|' + jobPositionId + '|Long');
    }

    this.appService.getAllByCriteria('JobAppli', parameters)
    .subscribe((data: JobAppli[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}