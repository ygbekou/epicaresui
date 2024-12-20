import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { MatVideoModule } from 'mat-video';
import { SharedModule } from '../../shared/shared.module';
import { ProjectsComponent } from './projects.component';
import { ProjectComponent } from './project/project.component';
import { TranslateModule } from '@ngx-translate/core';


@NgModule({
  declarations: [
    ProjectsComponent,
    ProjectComponent
  ],
  exports: [
    ProjectsComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    AgmCoreModule,
    MatVideoModule,
    SharedModule
  ]
})
export class ProjectsNoRoutesModule { }
