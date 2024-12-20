import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { News, Transaction } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/token.storage';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TransactionComponent } from '../transaction/transaction.component';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-transaction-list',
  templateUrl: './transaction-list.component.html',
  styleUrls: ['./transaction-list.component.scss']
})
export class TransactionListComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['id', 'tranDate', 'memberName', 'projectTitle', 'amount', 'actions' ];
  dataSource: MatTableDataSource<Transaction>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  @ViewChild(TransactionComponent, { static: false }) transactionView: TransactionComponent;

  selected = new FormControl(0);
  messages: any;

  constructor(public appService:AppService,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage) {

      super(translate, tokenStorage);
    }

  ngOnInit() {
    const parameters: string[] = [];
    this.appService.getAllByCriteriaWithFiles('Transaction', parameters).subscribe((data: Transaction[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public remove(transaction : Transaction) {
    const index: number = this.dataSource.data.indexOf(transaction);

    if (index !== -1) {
      this.appService.delete(transaction.id, 'Transaction')
      .subscribe(data => {
          this.processDeleteResult(data, this.messages);
          this.dataSource.data.splice(index,1);
          this.dataSource = new MatTableDataSource<Transaction>(this.dataSource.data);
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

  edit(id: number) {
    this.transactionView.getTransaction(id);
    this.selected.setValue(1);
  }

  saveEventListener(trans: Transaction) {
    this.updateDatasourceData(this.dataSource, this.paginator, this.sort, trans);
  }
}