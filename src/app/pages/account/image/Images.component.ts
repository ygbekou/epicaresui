import { Component, OnInit, ViewChild } from '@angular/core';
import { Image } from 'src/app/app.models';
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
  selector: 'app-images-component',
  templateUrl: './Images.component.html',
  styleUrls: ['./Images.component.scss']
})
export class ImagesComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['description', 'rank', 'status', 'actions'];
  dataSource: MatTableDataSource<Image>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  image: Image = new Image();
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
    this.appService.getAllByCriteria('Image', parameters)
      .subscribe((data: Image[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all Image complete'));
  }

  clearMessages($event) {
    this.messages = '';
  }

  setImage($event) {
    this.image = $event;
  }

  clear() {
    this.image = new Image();
  }

  getImage(imageId: number) {
    this.appService.getOneWithChildsAndFiles(imageId, 'Image')
      .subscribe(result => {
        if (result.id > 0) {
          this.image = result;
          const images: any[] = [];
          this.image.fileNames.forEach(item => {
            const image = {
              link: 'assets/images/images/' + imageId + '/' + item,
              preview: 'assets/images/images/' + imageId + '/' + item
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

  save() {
    this.image.modifiedBy = +this.tokenStorage.getUserId();
    this.formData = new FormData();

    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.files.length; i++) {
      if (this.files[i].file) {
        this.formData.append('file[]', this.files[i].file, 'picture.' + this.files[i].file.name);
      }
    }

    if (this.files.length > 0) {
      this.appService.saveWithFile(this.image, 'Image', this.formData, 'saveWithFile')
        .subscribe(result => {
          this.processResult(result, this.image, null);
          this.image = result;
          this.onSave(this.image);
        });
    } else {
      this.appService.save(this.image, 'Image')
        .subscribe(result => {
          this.processResult(result, this.image, null);
          this.image = result;
          this.onSave(this.image);
        });
    }
  }


  public remove(im: Image) {
    this.messages = '';
    this.appService.delete(im.id, 'Image')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(im);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<Image>(this.dataSource.data);
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
