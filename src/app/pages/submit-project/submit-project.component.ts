/* /// <reference types="@types/googlemaps" />
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { MatStepper } from '@angular/material/stepper';
import { AppService } from 'src/app/app.service';
import { Project, User, Video } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AppSettings } from 'src/app/app.settings';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { BaseComponent } from 'src/app/shared/baseComponent';

@Component({
  selector: 'app-submit-project',
  templateUrl: './submit-project.component.html',
  styleUrls: ['./submit-project.component.scss']
})
export class SubmitProjectComponent extends BaseComponent implements OnInit {
  @ViewChild('horizontalStepper') horizontalStepper: MatStepper;
  @ViewChild('addressAutocomplete') addressAutocomplete: ElementRef;
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
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  formData: FormData;
  files: any[];
  picture: any;
  news: any;
  done = false;

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    public translate: TranslateService,
    public tokenStorage: TokenStorage,
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
      .subscribe(() => {
        this.removeElement(this.project.fileNames, fileName);
      });
  }


  ngOnInit() {
    let lang = navigator.language;
    if (lang) {
      lang = lang.substring(0, 2);
    }
    if (Cookie.get('lang')) {
      lang = Cookie.get('lang');
      console.log('Using cookie lang=' + Cookie.get('lang'));
    } else if (lang) {
      console.log('Using browser lang=' + lang);
      // this.translate.use(lang);
    } else {
      lang = 'fr';
      console.log('Using default lang=fr');
    }
    if (lang === 'fr') {
      this.flag = this.flags[0];
    } else {
      this.flag = this.flags[1];
    }

    this.activatedRoute.params.subscribe(params => {
      if (params.id === '0') {
        this.clear();
        this.getUserOpenProject();
      } else {
        this.getProject(params.id);
      }
    });
  }

  getUserOpenProject() {
    if (this.tokenStorage.getUserId()) {
      const parameters: string[] = [];
      parameters.push('e.user.id = |abc|' + this.tokenStorage.getUserId() + '|Long');
      parameters.push('e.status = |efg|0|Integer');
      this.appService.getAllByCriteriaWithFiles('Project', parameters)
        .subscribe((data: Project[]) => {
          if (data && data.length > 0) {
            this.project = data[0];
            this.getProject(this.project.id);
            console.log(this.project);
          }
        });
    }
  }
  public addVideo(): void {
    if(!this.project.videos){
      this.project.videos =[];
    }
    this.project.videos.push(new Video());
  }

  public deleteVideo(id: number, index: number) {

    if (id === undefined || id === null) {
      this.removeItem(this.project.videos, id);
      return;
    }

    this.appService.delete(id, 'com.wack.model.Video')
      .subscribe(data => {
        this.removeItem(this.project.videos, id);
        this.processDeleteResult(data, this.messages);
      });
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
    this.messages = '';
    this.error = '';
    let almostDone = false;
    if (this.horizontalStepper.selectedIndex < 5) {
      if (this.horizontalStepper.selectedIndex === 0) {
        if (!this.project.title || this.project.title.length < 1 ||
          !this.project.location || this.project.location.length < 1 ||
          !this.project.budget || !(this.project.budget > 0) ||
          !this.project.duration || this.project.duration.length < 1 ||
          !this.project.description || this.project.description.length < 1 ||
          !this.project.objectif || this.project.objectif.length < 1
        ) {
          this.translate.get(['VALIDATION.FILL_FIELD_MARKED', 'COMMON.ERROR']).subscribe(res => {
            this.error = res['VALIDATION.FILL_FIELD_MARKED'];
          });
        } else {
          this.horizontalStepper.selectedIndex++;
        }
      } else if (this.horizontalStepper.selectedIndex === 1) {
        if (!this.project.inovation || this.project.inovation.length < 1 ||
          !this.project.existant || this.project.existant.length < 1
        ) {
          this.translate.get(['VALIDATION.FILL_FIELD_MARKED', 'COMMON.ERROR']).subscribe(res => {
            this.error = res['VALIDATION.FILL_FIELD_MARKED'];
          });
        } else {
          this.horizontalStepper.selectedIndex++;
        }
      } else if (this.horizontalStepper.selectedIndex === 2) {
        if (!this.project.resource || this.project.resource.length < 1 ||
          !this.project.constraints || this.project.constraints.length < 1
        ) {
          this.translate.get(['VALIDATION.FILL_FIELD_MARKED', 'COMMON.ERROR']).subscribe(res => {
            this.error = res['VALIDATION.FILL_FIELD_MARKED'];
          });
        } else {
          this.horizontalStepper.selectedIndex++;
        }
      } else if (this.horizontalStepper.selectedIndex === 3) {
        if (!this.project.budgetLine || this.project.budgetLine.length < 1 ||
          !this.project.result || this.project.result.length < 1
        ) {
          this.translate.get(['VALIDATION.FILL_FIELD_MARKED', 'COMMON.ERROR']).subscribe(res => {
            this.error = res['VALIDATION.FILL_FIELD_MARKED'];
          });
        } else {
          this.horizontalStepper.selectedIndex++;
        }
      } else if (this.horizontalStepper.selectedIndex === 4) {
        if (!this.project.feasibility || this.project.feasibility.length < 1 ||
          !this.project.execution || this.project.execution.length < 1
        ) {
          this.translate.get(['VALIDATION.FILL_FIELD_MARKED', 'COMMON.ERROR']).subscribe(res => {
            this.error = res['VALIDATION.FILL_FIELD_MARKED'];
          });
        } else {
          this.horizontalStepper.selectedIndex++;
        }
      }
    }else{
      almostDone=true;
    }
    console.log(this.error);
    if (!this.error) {
      console.log('Passed ' + this.error);
      this.project.modifiedBy = +this.tokenStorage.getUserId();
      if(this.project.user && this.project.user.id>0){
        // do nothing
      }else{
        const u = new User();
        u.id = Number(this.tokenStorage.getUserId());
        this.project.user = u;
      }

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
      if(!(this.project.status && this.project.status>0)){
        this.project.status = 0;
      }      
      if (this.files.length > 0) {
        this.appService.saveWithFile(this.project, 'Project', this.formData, 'saveWithFile')
          .subscribe(result => {
            if (result.id > 0) {
              console.log('saveWithFile');
              this.project = result;
              console.log('Index = '+ this.horizontalStepper.selectedIndex);
              if (almostDone) {
                this.done = true;
              } else {
                this.translate.get(['MESSAGE.DATA_SAVED', 'COMMON.SUCCESS']).subscribe(res => {
                  this.messages = res['MESSAGE.DATA_SAVED'];
                });
              }
            } else {
              this.translate.get(['MESSAGE.DATA_SAVED_FAILED', 'COMMON.ERROR']).subscribe(res => {
                this.error = res['MESSAGE.DATA_SAVED_FAILED'];
              });
            }
          });
      } else {
        this.appService.save(this.project, 'Project')
          .subscribe(result => {
            if (result.id > 0) {
              this.project = result;
              console.log('Saved');
              console.log('Index = '+ this.horizontalStepper.selectedIndex);
              if (almostDone) {
                this.done = true;
              } else {
                this.translate.get(['MESSAGE.DATA_SAVED', 'COMMON.SUCCESS']).subscribe(res => {
                  this.messages = res['MESSAGE.DATA_SAVED'];
                });
              }
            } else {
              this.translate.get(['MESSAGE.DATA_SAVED_FAILED', 'COMMON.ERROR']).subscribe(res => {
                this.error = res['MESSAGE.DATA_SAVED_FAILED'];
              });
            }
          });
      }
    }
  }

  canEdit(){
    return this.tokenStorage.hasToken() && ( this.project &&       
    (!(this.project.id >0)|| (this.project.id >0 && this.project.status === 0 &&
    Number(this.tokenStorage.getUserId()) === this.project.user.id)));
  }
  isAdmin(){
    return this.tokenStorage.hasToken() && this.project &&
    this.tokenStorage.getRole() !== '30'
  }

  clear() {
    this.project = new Project();
  }

  onSelectionChange($event) {

  }
} */