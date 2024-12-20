import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProjectsComponent } from './projects.component';
import { ProjectComponent } from './project/project.component';
import { ProjectsNoRoutesModule } from './projectsNoRoutes.module';

export const routes = [
  { path: '', component: ProjectsComponent, pathMatch: 'full' },
  { path: ':id', component: ProjectComponent }
];

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    ProjectsNoRoutesModule,
    RouterModule.forChild(routes),
  ]
})
export class ProjectsModule { }
