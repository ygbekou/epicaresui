import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { User, Employee, PositionDesc } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Cookie } from 'ng2-cookies/ng2-cookies';
import { TranslateService } from '@ngx-translate/core';
import { AppSettings, Settings } from 'src/app/app.settings';
import { BaseComponent } from 'src/app/shared/baseComponent';
import { TokenStorage } from 'src/app/token.storage';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-user-component',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'image', 'title', 'published', 'views', 'actions'];
  dataSource: MatTableDataSource<User>;
  public toolbarTypes = [1, 2];
  public headerTypes = ['default', 'image', 'carousel'];

  public userGroups = [];
  user: User = new User();
  messages: any;
  error: string;
  public settings: Settings;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  formData: FormData;
  picture: any[] =[];
  activePositions: PositionDesc[];

  constructor(public appService: AppService,
    public appSettings: AppSettings,
    public translate: TranslateService,
    public tokenStorage: TokenStorage,
    private activatedRoute: ActivatedRoute) {
    super(translate, tokenStorage);
    if (this.translate.currentLang === 'fr') {
      this.userGroups = [
        { id: 1, name: 'Admin', type: 'UserGroup'},
        { id: 10, name: 'Editeur', type: 'UserGroup' },
        { id: 20, name: 'Financier', type: 'UserGroup' },
        { id: 30, name: 'Membre', type: 'UserGroup' }
      ];
    } else {
      this.userGroups = [
        { id: 1, name: 'Admin', type: 'UserGroup' },
        { id: 10, name: 'Editor', type: 'UserGroup' },
        { id: 20, name: 'Finance', type: 'UserGroup' },
        { id: 30, name: 'Member', type: 'UserGroup' }
      ];
    }
  }

  public deleteFile(user: User, fileName: string) {
    const vo = {id: user.id, name: fileName};
    this.appService.deleteFile('com.wack.model.User', vo)
      .subscribe(data => {
      });
  }

  ngOnInit() {
    this.getActivePositions();
    this.activatedRoute.params.subscribe(params => {
      if (params.id !== undefined) {
        this.getUser(params.id);
      } else {
        this.getUser(+this.tokenStorage.getUserId());
      }
    });
  }


  getUser(userId: number) {
    if (userId === 0) {
      this.user = new User();
    }

    if (userId > 0)
      this.appService.getOneWithChildsAndFiles(userId, 'User')
        .subscribe(result => {
          if (result.id > 0) {
            this.user = result;
            this.user.confirmPassword = this.user.password;
            const images: any[] = [];
            this.user.fileNames.forEach(item=>{
              const image = {
                link: 'assets/images/users/' + userId + '/' + item,
              preview: 'assets/images/users/' + userId + '/' + item
              }
              images.push(image);
            })

            this.picture = images;

            if (this.user.employees && this.user.employees.length > 0) {
              this.user.shortResume = this.user.employees[0].shortResume;
              this.user.resume = this.user.employees[0].resume;
            }

          } else {
            this.translate.get(['COMMON.READ', 'MESSAGE.READ_FAILED']).subscribe(res => {

              this.error = res['MESSAGE.READ_FAILED'];

            });
          }
        });
  }

  public getActivePositions() {
    const parameters: string[] = [];
    parameters.push('e.language = |language|' + this.appService.getFlag().code + '|String');
    parameters.push('e.position.status = |status|1|Integer');
    this.appService.getAllByCriteriaWithFiles('PositionDesc', parameters).subscribe((data: PositionDesc[]) => {
      this.activePositions = data;
    });
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  save() {
    this.messages = '';
    this.user.modifiedBy = +this.tokenStorage.getUserId();
    this.formData = new FormData();

    this.user.status = (this.user.status == null || this.user.status.toString() === 'false') ? 0 : 1;

    if  (this.picture && this.picture.length>0 && this.picture[0].file) {
      this.formData.append('file[]', this.picture[0].file, 'picture.png');
    }

    if (this.user.userGroup.id !== 4 && this.user.employees) {
      if (this.user.employees.length === 0) {
        // Adding an employee model to user
        const employee = new Employee();
        employee.resume = this.user.resume;
        employee.shortResume = this.user.shortResume;
        this.user.employees.push(employee);
      } else {
        this.user.employees[0].shortResume = this.user.shortResume;
        this.user.employees[0].resume = this.user.resume;
      }
    }

    for (const userDesc of this.user.userDescs) {
      userDesc.user = new User();
      userDesc.user.id = this.user.id;
    }

    this.appService.saveWithFile(this.user, 'User', this.formData, 'saveWithFile')
      .subscribe(data => {
        this.processResult(data, this.user, null)
        this.user = data;

        this.user.confirmPassword = this.user.password;
        if (this.user.employees && this.user.employees.length > 0) {
          this.user.shortResume = this.user.employees[0].shortResume;
          this.user.resume = this.user.employees[0].resume;
        }

      });

  }

  clear() {

  }

}