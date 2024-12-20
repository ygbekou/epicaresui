import { Component, OnInit, ViewChild } from '@angular/core';
import { PositionDesc, Position } from 'src/app/app.models';
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
  selector: 'app-positions-component',
  templateUrl: './Positions.component.html',
  styleUrls: ['./Positions.component.scss']
})
export class PositionsComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['name', 'status', 'actions'];
  dataSource: MatTableDataSource<PositionDesc>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  position: Position = new Position();

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage) {
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
    this.appService.getAllByCriteria('PositionDesc', parameters)
      .subscribe((data: PositionDesc[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all PositionDesc complete'));
  }

  clearMessages() {
    this.messages = '';
  }

  setPosition($event) {
    this.position = $event;
  }

  clear() {
    this.position = new Position();
    this.position.positionDescs = [];
    for (const flag of this.appService.flags) {
      const pd = new PositionDesc();
      pd.language = flag.code;
      pd.name = '';
      this.position.positionDescs.push(pd);
    }
  }

  getDescriptions(positionId: number) {
    this.messages = '';
    const parameters: string[] = [];
    if (positionId != null) {
      parameters.push('e.position.id = |positionId|' + positionId + '|Long');
    }
    this.appService.getAllByCriteria('PositionDesc', parameters)
      .subscribe((data: PositionDesc[]) => {

        if (data !== null && data.length > 0) {
          this.position = data[0].position;
          this.position.positionDescs = data;

        }
      },
        error => console.log(error),
        () => console.log('Get all position desc complete'));
  }

  setToggles() {
    this.position.status = (this.position.status == null
      || this.position.status.toString() === 'false'
      || this.position.status.toString() === '0') ? 0 : 1;

    this.position.leadership = (this.position.leadership == null
      || this.position.leadership.toString() === 'false'
      || this.position.leadership.toString() === '0') ? 0 : 1;


  }

  save() {
    this.messages = '';
    try {
      this.setToggles();
      const thisposition = { ...this.position };
      this.cleanDescriptions(thisposition);

      this.appService.save(thisposition, 'Position')
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.position, null);
            this.position = { ...result };
            this.onSave(this.position);
            console.log(this.position)
            this.clear();
          }
        });

    } catch (e) {
      console.log(e);
    }
  }

  cleanDescriptions(p: Position) {
    p.positionDescs.forEach(element => {
      element.position = undefined;
    });
  }

  public remove(pDesc: PositionDesc) {
    this.messages = '';
    this.appService.delete(pDesc.position.id, 'Position')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(pDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<PositionDesc>(this.dataSource.data);
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
    const pos = $event;

    let i = 0;
    pos.positionDescs.forEach(element => {
      if (element.language === this.appService.getFlag().code) {
        const pdesc = { ...pos.positionDescs[i] }
        pdesc.position = pos;
        if (!this.dataSource.data) {
          this.dataSource.data = [];
        }
        this.updateDatasourceData(this.dataSource, this.paginator, this.sort, pdesc);
      }
      i++;
    });
  }
}
