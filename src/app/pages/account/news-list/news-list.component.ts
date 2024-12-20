import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { News } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/token.storage';
import { BaseComponent } from 'src/app/shared/baseComponent';

@Component({
  selector: 'app-news-list',
  templateUrl: './news-list.component.html',
  styleUrls: ['./news-list.component.scss']
})
export class NewsListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'lang', 'title', 'publicationDatetime', 'actions' ];
  dataSource: MatTableDataSource<News>;
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
    this.appService.getAllByCriteriaWithFiles('com.wack.model.News', parameters).subscribe((data: News[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public remove(news : News) {
    const index: number = this.dataSource.data.indexOf(news);

    if (index !== -1) {
      this.appService.delete(news.id, 'com.wack.model.News')
      .subscribe(data => {
          console.info(data);
          
          this.processDeleteResult(data, this.messages);

          this.dataSource.data.splice(index,1);
          this.dataSource = new MatTableDataSource<News>(this.dataSource.data);
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