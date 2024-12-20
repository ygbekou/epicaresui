import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { ContactUsMessage } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings, Settings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-cmessage-component',
  templateUrl: './cmessage.component.html',
  styleUrls: ['./cmessage.component.scss']
})
export class CmessageComponent extends BaseComponent implements OnInit {
  dataSource: MatTableDataSource<ContactUsMessage>;
  public toolbarTypes = [1, 2];
  public headerTypes = ['default', 'image', 'carousel'];
  public flags = [
    { name: 'Francais', image: 'assets/images/flags/fr.svg', code: 'fr' },
    { name: 'English', image: 'assets/images/flags/gb.svg', code: 'en' }
  ];

  public flag: any;
  cmessage: ContactUsMessage = new ContactUsMessage();
  messages: any;
  error: string;
  public settings: Settings;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    private activatedRoute: ActivatedRoute) {

    super(translate, tokenStorage);

  }

  ngOnInit() {

    this.activatedRoute.params.subscribe(params => {
      this.getCmessage(params.id);
    });
  }


  getCmessage(cmessageId: number) {
    if (cmessageId === 0) {
      this.cmessage = new ContactUsMessage();
    }

    if (cmessageId > 0)
      this.appService.getOneWithChildsAndFiles(cmessageId, 'ContactUsMessage')
        .subscribe(result => {
          if (result.id > 0) {
            this.cmessage = result;
          } else {
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {

              this.error = res['MESSAGE.READ_FAILED'];

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

}