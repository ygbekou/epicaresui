import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { News, JobPositionDesc } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/token.storage';
import { BaseComponent } from 'src/app/shared/baseComponent';

@Component({
  selector: 'app-job-position-list',
  templateUrl: './job-position-list.component.html',
  styleUrls: ['./job-position-list.component.scss']
})
export class JobPositionListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'rank', 'title', 'desc', 'createDatetime', 'resumeCnt', 'actions'];
  dataSource: MatTableDataSource<JobPositionDesc>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages: any;

  constructor(public appService: AppService,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage) {

    super(translate, tokenStorage);
  }

  ngOnInit() {

    const searchCrit = {
      language: this.appService.getFlag().code
    }

    this.appService.saveWithUrl('/service/career/jobPositionDesc/search', searchCrit)
      .subscribe((data: JobPositionDesc[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
  }

  public remove(jobPositionDesc: JobPositionDesc) {
    const index: number = this.dataSource.data.indexOf(jobPositionDesc);

    if (index !== -1) {
      this.appService.delete(jobPositionDesc.jobPosition.id, 'com.wack.model.JobPosition')
        .subscribe(data => {
          console.info(data);

          this.processDeleteResult(data, this.messages);

          this.dataSource.data.splice(index, 1);
          this.dataSource = new MatTableDataSource<JobPositionDesc>(this.dataSource.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });

    }
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}