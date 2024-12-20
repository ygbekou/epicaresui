import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ContactUsMessage } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/token.storage';
import { BaseComponent } from 'src/app/shared/baseComponent';

@Component({
  selector: 'app-cmessage-list',
  templateUrl: './cmessage-list.component.html',
  styleUrls: ['./cmessage-list.component.scss']
})

export class CmessageListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'name', 'email', 'phone', 'actions' ];
  dataSource: MatTableDataSource<ContactUsMessage>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  messages: any;

  constructor(public appService:AppService,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage) {

      super(translate, tokenStorage);
    }

  ngOnInit() {
    const parameters: string[] = [];
    this.appService.getAllByCriteriaWithFiles('ContactUsMessage', parameters, ' ORDER BY e.id DESC ')
      .subscribe((data: ContactUsMessage[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public remove(contactUsMessage : ContactUsMessage) {
    const index: number = this.dataSource.data.indexOf(contactUsMessage);

    if (index !== -1) {
      this.appService.delete(contactUsMessage.id, 'ContactUsMessage')
      .subscribe(data => {

          this.processDeleteResult(data, this.messages);

          this.dataSource.data.splice(index,1);
          this.dataSource = new MatTableDataSource<ContactUsMessage>(this.dataSource.data);
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