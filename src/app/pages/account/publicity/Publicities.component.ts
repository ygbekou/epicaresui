import { Component, OnInit, ViewChild } from '@angular/core';
import { Publicity } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppService } from 'src/app/app.service';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { AppSettings } from 'src/app/app.settings';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-publicities-component',
  templateUrl: './Publicities.component.html',
  styleUrls: ['./Publicities.component.scss']
})
export class PublicitiesComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['description', 'url', 'beginDate', 'endDate', 'rank', 'cost', 'status', 'actions'];
  dataSource: MatTableDataSource<Publicity>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  publicity: Publicity = new Publicity();
  selected = new FormControl(0);

  formData: FormData;
  files: any[];
  picture: any;

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
  }

  getAll() {
    const parameters: string[] = [];
    this.appService.getAllByCriteria('Publicity', parameters)
      .subscribe((data: Publicity[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all Publicity complete'));
  }

  clearMessages($event) {
    this.messages = '';
  }

  setMeetingReport($event) {
    this.publicity = $event;
  }

  clear() {
    this.publicity = new Publicity();
  }

  getPublicity(publicityId: number) {
    this.appService.getOneWithChildsAndFiles(publicityId, 'Publicity')
      .subscribe(result => {
        if (result.id > 0) {
          this.publicity = result;
          const images: any[] = [];
          this.publicity.fileNames.forEach(item => {
            const image = {
              link: 'assets/images/publicitys/' + publicityId + '/' + item,
              preview: 'assets/images/publicitys/' + publicityId + '/' + item
            }
            images.push(image);
          })
          this.files = images;
          this.selected.setValue(0);
        } else {
          this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
            this.messages = res['MESSAGE.READ_FAILED'];
          });
        }
      });
  }

  setToggles() {
    this.publicity.status = (this.publicity.status == null
      || this.publicity.status.toString() === 'false'
      || this.publicity.status.toString() === '0') ? 0 : 1;
  }

  save() {
    this.publicity.modifiedBy = +this.tokenStorage.getUserId();
    this.formData = new FormData();

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.files.length; i++) {
      if (this.files[i].file) {
        this.formData.append('file[]', this.files[i].file, 'picture.' + this.files[i].file.name);
      }
    }

    this.publicity.status = (this.publicity.status == null || this.publicity.status.toString() === 'false') ? 0 : 1;
    if (this.files.length > 0) {
      this.appService.saveWithFile(this.publicity, 'Publicity', this.formData, 'saveWithFile')
        .subscribe(result => {
          this.processResult(result, this.publicity, null);
          this.publicity = result;
          this.onSave(this.publicity);
        });
    } else {
      this.appService.save(this.publicity, 'Publicity')
        .subscribe(result => {
          this.processResult(result, this.publicity, null);
          this.publicity = result;
          this.onSave(this.publicity);
        });
    }
  }


  public remove(pub: Publicity) {
    this.messages = '';
    this.appService.delete(pub.id, 'Publicity')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(pub);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<Publicity>(this.dataSource.data);
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
    this.updateDatasourceData(this.dataSource, this.paginator, this.sort, $event);
  }
}
