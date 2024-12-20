import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Event, EventDesc, User } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings, Settings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-event-component',
  templateUrl: './event.component.html',
  styleUrls: ['./event.component.scss']
})
export class EventComponent extends BaseComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'published', 'actions'];
  dataSource: MatTableDataSource<EventDesc>;
  public toolbarTypes = [1, 2];
  public headerTypes = ['default', 'image', 'carousel'];
  event: Event = new Event();
  messages: any;
  error: string;
  public flags = [
    { name: 'Francais', image: 'assets/images/flags/fr.svg', code: 'fr' },
    { name: 'English', image: 'assets/images/flags/gb.svg', code: 'en' }
  ];
  public flag: any;
  public settings: Settings;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  formData: FormData;
  files: any[];
  picture: any;

  hours: string[];
  minutes: string[];

  hour: string;
  minute: string;
  activeUsers: User[];

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage,
    private activatedRoute: ActivatedRoute) {

    super(translate, tokenStorage);

  }

  ngOnInit() {
    this.clear();
    this.getActiveUsers();
    this.activatedRoute.params.subscribe(params => {
      if (params.id === 0) {
        this.clear();
        this.flag = this.flags[0];
      } else {
        this.getDescriptions(params.id);
      }
    });
  }

  ngAfterViewInit() {
    this.minutes = ['00', '15', '30', '45'];
    this.hours = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23'];
  }

  public getActiveUsers() {
    const parameters: string[] = [];
    parameters.push('e.status = |status|1|Integer');
    this.appService.getAllByCriteriaWithFiles('User', parameters).subscribe((data: User[]) => {
      this.activeUsers = data;
    });
  }

  clearMessages() {
    this.messages = '';
  }

  setPosition($event) {
    this.event = $event;
  }

  clear() {
    this.event = new Event();
    this.event.eventDescs = [];
    for (const flag of this.appService.flags) {
      const ed = new EventDesc();
      ed.language = flag.code;
      this.event.eventDescs.push(ed);
    }
  }

  getDescriptions(eventId: number) {
    this.messages = '';

    this.appService.getOneWithChildsAndFiles(eventId, 'com.wack.model.Event')
      .subscribe(result => {
        if (result.id > 0) {
          this.event = result;
          this.setHours();
          const images: any[] = [];
          this.event.fileNames.forEach(item => {
            const image = {
              link: 'assets/images/events/' + eventId + '/' + item,
              preview: 'assets/images/events/' + eventId + '/' + item
            }
            images.push(image);
          })
          this.files = images;
        }
      },
        error => console.log(error),
        () => console.log('Get all event desc complete'));
  }

  setToggles() {
    this.event.status = (this.event.status == null
      || this.event.status.toString() === 'false'
      || this.event.status.toString() === '0') ? 0 : 1;
  }

  setHours() {
    this.event.beginHour = '0' + new Date(this.event.beginDate).getHours() + '';
    if (this.event.beginHour.length === 1) {
      this.event.beginHour += '0';
    }
    this.event.beginMinute = new Date(this.event.beginDate).getMinutes() + '';
    if (this.event.beginMinute.length === 1) {
      this.event.beginMinute += '0';
    }
    this.event.endHour = '0' + new Date(this.event.endDate).getHours() + '';
    if (this.event.endHour.length === 1) {
      this.event.endHour += '0';
    }
    this.event.endMinute = new Date(this.event.endDate).getMinutes() + '';
    if (this.event.endMinute.length === 1) {
      this.event.endMinute += '0';
    }
  }

  save() {
    this.messages = '';
    this.event.modifiedBy = +this.tokenStorage.getUserId();
    this.formData = new FormData();
    this.event.remainingFileNames = [];


    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.files.length; i++) {
      if (this.files[i].file) {
        console.log('Additional file added: ' + 'picture.' + this.files[i].file.name);
        this.formData.append('file[]', this.files[i].file, 'picture.' + this.files[i].file.name);
      } else {
        console.log(this.files[i]);
        const pathSplitArray = this.files[i].link.split('/');
        this.event.remainingFileNames.push(pathSplitArray[pathSplitArray.length - 1]);
      }
    }

    this.setToggles();
    const beginDateStr = new Date(this.event.beginDate)
      .toISOString()
      .split('T')[0];
    const endDateStr = new Date(this.event.beginDate)
      .toISOString()
      .split('T')[0];

    this.event.beginDate = new Date(beginDateStr + 'T' + this.event.beginHour + ':' + this.event.beginMinute + ':00');
    this.event.endDate = new Date(endDateStr + 'T' + this.event.endHour + ':' + this.event.endMinute + ':00');
    const thisEvent = { ...this.event };
    this.cleanDescriptions(thisEvent);

    if (this.files.length > 0) {
      this.appService.saveWithFile(thisEvent, 'Event', this.formData, 'saveWithFile')
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.event, null);
            this.event = { ...result };
            this.onSave(this.event);
            this.setHours();
            this.clear();
          } else {
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        });
    } else {
      this.appService.save(thisEvent, 'Event')
        .subscribe(result => {
          if (result.id > 0) {
            this.processResult(result, this.event, null);
            this.event = { ...result };
            this.onSave(this.event);
            this.setHours();
            this.clear();
          } else {
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        });
    }


  }

  cleanDescriptions(e: Event) {
    e.eventDescs.forEach(element => {
      element.event = undefined;
    });
  }

  public remove(eDesc: EventDesc) {
    this.messages = '';
    this.appService.delete(eDesc.event.id, 'Event')
      .subscribe(resp => {
        if (resp.result === 'SUCCESS') {
          const index: number = this.dataSource.data.indexOf(eDesc);
          if (index !== -1) {
            this.dataSource.data.splice(index, 1);
            this.dataSource = new MatTableDataSource<EventDesc>(this.dataSource.data);
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
    const ev = $event;

    let i = 0;
    ev.eventDescs.forEach(element => {
      if (element.language === this.appService.getFlag().code) {
        const edesc = { ...ev.eventDescs[i] }
        edesc.event = ev;
      }
      i++;
    });
  }


  hourSelectionChange(event) {

  }

  minuteSelectionChange(event) {
  }
}