import { Component, OnInit, ViewChild } from '@angular/core';
import { MeetingReport, MeetingReportDesc, User, Publicity, Video } from 'src/app/app.models';
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
  selector: 'app-videos-component',
  templateUrl: './Videos.component.html',
  styleUrls: ['./Videos.component.scss']
})
export class VideosComponent extends BaseComponent implements OnInit {

  displayedColumns: string[] = ['description', 'videoDate', 'rank', 'status', 'vote', 'voteCount', 'actions'];
  dataSource: MatTableDataSource<Publicity>;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  messages = '';
  video: Video = new Video();
  selected = new FormControl(0);

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
    this.appService.getAllByCriteria('Video', parameters)
      .subscribe((data: Publicity[]) => {
        this.dataSource = new MatTableDataSource(data);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
        error => console.log(error),
        () => console.log('Get all Video complete'));
  }

  clearMessages($event) {
    this.messages = '';
  }

  setVideo($event) {
    this.video = $event;
  }

  clear() {
    this.video = new Video();
  }

  getVote(videoId: number) {
    this.appService.getOneWithChildsAndFiles(videoId, 'Video')
      .subscribe(result => {
        if (result.id > 0) {
          this.video = result;
          this.selected.setValue(0);
        } else {
          this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
            this.messages = res['MESSAGE.READ_FAILED'];
          });
        }
      });
  }

  save() {
    this.video.modifiedBy = +this.tokenStorage.getUserId();

    this.appService.save(this.video, 'Video')
      .subscribe(result => {
        this.processResult(result, this.video, null);
        this.video = result;
        this.onSave(this.video);
      });
  }


  public remove(video: Video) {
    this.messages = '';
    this.appService.delete(video.id, 'Video')
      .subscribe(resp => {
        this.processDeleteResult(resp, this.messages);
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
