import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { Project, ProjectDesc } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings, Settings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-component',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent extends BaseComponent implements OnInit {
  public toolbarTypes = [1, 2];
  public headerTypes = ['default', 'image', 'carousel'];
  public flags = [
    { name: 'Francais', image: 'assets/images/flags/fr.svg', code: 'fr' },
    { name: 'English', image: 'assets/images/flags/gb.svg', code: 'en' }
  ];

  public flag: any;
  project: Project = new Project();
  projects: Project[] = [];
  messages: any;
  error: string;
  public settings: Settings;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

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

  public changeLang(flag) {
    this.flag = flag;
    if (this.project === null) {
      this.clear();
    }
  }

  public deleteFile(project: Project, fileName: string) {
    const vo = { id: project.id, name: fileName };
    this.appService.deleteFile('Project', vo)
      .subscribe(data => {
        this.removeElement(this.project.fileNames, fileName);
      });
  }


  ngOnInit() {
    this.clear();
    this.activatedRoute.params.subscribe(params => {
      if (params.id === 0) {
        this.clear();
        this.flag = this.flags[0];
      } else {
        this.getDescriptions(params.id);
      }
    });
  }


  getDescriptions(projectId: number) {
    this.messages = '';

    this.appService.getOneWithChildsAndFiles(projectId, 'com.wack.model.Project')
      .subscribe(result => {
        if (result.id > 0) {
          this.project = result;
          const images: any[] = [];
          this.project.fileNames.forEach(item => {
            const image = {
              link: 'assets/images/projects/' + projectId + '/' + item,
              preview: 'assets/images/projects/' + projectId + '/' + item
            }
            images.push(image);
          })
          this.files = images;
        }
      },
        error => console.log(error),
        () => console.log('Get all project desc complete'));
  }

  getProject(projectId: number) {
    this.appService.getOneWithChildsAndFiles(projectId, 'Project')
      .subscribe(result => {
        if (result.id > 0) {
          this.project = result;

          console.log(this.project);
          const images: any[] = [];
          this.project.fileNames.forEach(item => {
            const image = {
              link: 'assets/images/projects/' + projectId + '/' + item,
              preview: 'assets/images/projects/' + projectId + '/' + item
            }
            images.push(image);
          })
          this.files = images;

        } else {
          this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {
            this.messages = res['MESSAGE.READ_FAILED'];
          });
        }
      });
  }

  save() {
    this.project.modifiedBy = +this.tokenStorage.getUserId();
    this.formData = new FormData();
    this.project.remainingFileNames = [];


    // tslint:disable-next-line: prefer-for-of
    for (let i = 0; i < this.files.length; i++) {
      if (this.files[i].file) {
        console.log('Additional file added: ' + 'picture.' + this.files[i].file.name);
        this.formData.append('file[]', this.files[i].file, 'picture.' + this.files[i].file.name);
      } else {
        console.log(this.files[i]);
        const pathSplitArray = this.files[i].link.split('/');
        this.project.remainingFileNames.push(pathSplitArray[pathSplitArray.length - 1]);
      }
    }


    //this.project.status = (this.project.status == null || this.project.status.toString() === 'false') ? 0 : 1;

    if (this.files.length > 0) {
      this.appService.saveWithFile(this.project, 'Project', this.formData, 'saveWithFile')
        .subscribe(result => {
          if (result.id > 0) {
            console.log('saveWithFile');
            this.project = result;
            this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_SUCCESS'];
            });
          } else {
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        });
    } else {
      this.appService.save(this.project, 'Project')
        .subscribe(result => {
          if (result.id > 0) {
            this.project = result;
            console.log('Saved');
            this.translate.get(['MESSAGE.SAVE_SUCCESS', 'COMMON.SUCCESS']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_SUCCESS'];
            });
          } else {
            this.translate.get(['MESSAGE.SAVE_UNSUCCESS', 'COMMON.ERROR']).subscribe(res => {
              this.messages = res['MESSAGE.SAVE_UNSUCCESS'];
            });
          }
        });
    }
  }

  clear() {
    this.project = new Project();
    this.project.projectDescs = [];
    for (const flag of this.appService.flags) {
      const ed = new ProjectDesc();
      ed.language = flag.code;
      this.project.projectDescs.push(ed);
    }
  }

  clearMessages() {
    this.messages = '';
  }


  onToggleGroupChange(event) {
    this.project.status = event.value;
  }
}