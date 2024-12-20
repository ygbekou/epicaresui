import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { EventDesc } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/token.storage';
import { BaseComponent } from 'src/app/shared/baseComponent';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html',
  styleUrls: ['./event-list.component.scss']
})
export class EventListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'rank', 'title', 'desc', 'startDatetime', 'endDatetime', 'actions'];
  dataSource: MatTableDataSource<EventDesc>;
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

    // this.appService.saveWithUrl('/service/career/eventDesc/search', searchCrit)
    //   .subscribe((data: EventDesc[]) => {
    //     this.dataSource = new MatTableDataSource(data);
    //     this.dataSource.paginator = this.paginator;
    //     this.dataSource.sort = this.sort;
    //   });

    const parameters: string[] = [];
    if(this.tokenStorage.getRole()==='30'){
      parameters.push('e.coordinator.id = |abc|' + this.tokenStorage.getUserId() + '|Long');
    }
    parameters.push('e.language = |language|' + this.appService.getFlag().code + '|String');
    this.appService.getAllByCriteriaWithFiles('EventDesc', parameters).subscribe((data: EventDesc[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public remove(eventDesc: EventDesc) {
    const index: number = this.dataSource.data.indexOf(eventDesc);

    if (index !== -1) {
      this.appService.delete(eventDesc.event.id, 'Event')
        .subscribe(data => {
          this.processDeleteResult(data, this.messages);

          this.dataSource.data.splice(index, 1);
          this.dataSource = new MatTableDataSource<EventDesc>(this.dataSource.data);
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