import { Component, OnInit, ViewChild } from '@angular/core';
import { AppService } from 'src/app/app.service';
import { News, Project, ProjectDesc } from 'src/app/app.models';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TranslateService } from '@ngx-translate/core';
import { TokenStorage } from 'src/app/token.storage';
import { BaseComponent } from 'src/app/shared/baseComponent';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent extends BaseComponent implements OnInit {
  displayedColumns: string[] = ['id', 'title', 'budget','owner', 'createDate','status'];
  dataSource: MatTableDataSource<ProjectDesc>;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  messages: any;

  constructor(public appService:AppService,
    protected translate: TranslateService,
    protected tokenStorage: TokenStorage) {

      super(translate, tokenStorage);
    }

  ngOnInit() {
    const parameters: string[] = [];
    if(this.tokenStorage.getRole()==='30'){
      parameters.push('e.user.id = |abc|' + this.tokenStorage.getUserId() + '|Long');
    }
    parameters.push('e.language = |lang|' + this.getLang() + '|String');
    this.appService.getAllByCriteriaWithFiles('ProjectDesc', parameters).subscribe((data: ProjectDesc[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    });
  }

  public remove(proj : ProjectDesc) {
    const index: number = this.dataSource.data.indexOf(proj);

    if (index !== -1) {
      this.appService.delete(proj.project.id, 'Project')
      .subscribe(data => {
          console.log(data);
          this.processDeleteResult(data, this.messages);

          this.dataSource.data.splice(index,1);
          this.dataSource = new MatTableDataSource<ProjectDesc>(this.dataSource.data);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      });

    }
  }

  public applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}