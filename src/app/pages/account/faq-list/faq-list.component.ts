import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Faq } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/token.storage';
import { BaseComponent } from 'src/app/shared/baseComponent';

@Component({
  selector: 'app-faq-list',
  templateUrl: './faq-list.component.html',
  styleUrls: ['./faq-list.component.scss']
})
export class FaqListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'language', 'question', 'noCount', 'yesCount', 'actions' ];
  dataSource: MatTableDataSource<Faq>;
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
    this.appService.getAllByCriteriaWithFiles('com.wack.model.website.Faq', parameters).subscribe((data: Faq[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public remove(faq : Faq) {
    const index: number = this.dataSource.data.indexOf(faq);

    if (index !== -1) {
      this.appService.delete(faq.id, 'Faq')
      .subscribe(data => {

          this.processDeleteResult(data, this.messages);

          this.dataSource.data.splice(index,1);
          this.dataSource = new MatTableDataSource<Faq>(this.dataSource.data);
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