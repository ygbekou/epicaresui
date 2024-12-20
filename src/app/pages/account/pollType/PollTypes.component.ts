import { Component, OnInit, ViewChild } from '@angular/core';
import { PollTypeDesc, PollType } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { AppSettings } from 'src/app/app.settings';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-pollTypes-component',
  templateUrl: './PollTypes.component.html',
  styleUrls: ['./PollTypes.component.scss']
})
export class PollTypesComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['name', 'status', 'actions'];
  dataSource: MatTableDataSource<PollTypeDesc>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  pollType: PollType = new PollType();

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
  }

  getAll() {
    const parameters: string[] = [];
    parameters.push('e.language = |langCode|' + this.appService.getFlag().code + '|String');
    this.appService.getAllByCriteria('PollTypeDesc', parameters)
      .subscribe((data: PollTypeDesc[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all PollTypeDesc complete'));
  }

  clearMessages($event) {
    this.messages = '';
  }

  setPollType($event) {
    this.pollType = $event;
  }

  clear() {
    this.pollType = new PollType();
    this.pollType.pollTypeDescs = [];
    for (const flag of this.appService.flags) {
      const pd = new PollTypeDesc();
      pd.language = flag.code;
      pd.name = '';
      this.pollType.pollTypeDescs.push(pd);
    }
  }

  getDescriptions(pollTypeId: number) {
    this.messages = '';
    const parameters: string[] = [];
    if (pollTypeId != null) {
      parameters.push('e.pollType.id = |pollTypeId|' + pollTypeId + '|Long');
    }
    this.appService.getAllByCriteria('PollTypeDesc', parameters)
      .subscribe((data: PollTypeDesc[]) => {

        if (data !== null && data.length > 0) {
          this.pollType = data[0].pollType;
          this.pollType.pollTypeDescs = data;

        }
      },
        error => console.log(error),
        () => console.log('Get all pollType desc complete'));
  }


  setToggles() {
    this.pollType.status = (this.pollType.status == null
      || this.pollType.status.toString() === 'false'
      || this.pollType.status.toString() === '0') ? 0 : 1;
  }

  save() {
    this.messages = '';
    try {
      this.setToggles();
      const thispollType = {...this.pollType};
      this.cleanDescriptions(thispollType);

      this.appService.save(thispollType, 'PollType')
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.pollType, null);
            this.pollType = {...result};
            this.onSave(this.pollType);
            this.clear();
          }
        });

    } catch (e) {
      console.log(e);
    }
  }

  cleanDescriptions(p: PollType) {
    p.pollTypeDescs.forEach(element => {
       element.pollType = undefined;
    });
  }

  public remove(pDesc: PollTypeDesc) {
    this.messages = '';
    this.appService.delete(pDesc.pollType.id, 'PollType')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(pDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<PollTypeDesc>(this.dataSource.data);
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
    const pol = $event;

    let i = 0;
    pol.pollTypeDescs.forEach(element => {
        if (element.language === this.appService.getFlag().code) {
          const pdesc = {...pol.pollTypeDescs[i]}
          pdesc.pollType = pol;
          if (!this.dataSource.data) {
            this.dataSource.data = [];
          }
          this.updateDatasourceData(this.dataSource, this.paginator, this.sort, pdesc);
        }
        i++;
    });
  }
}
