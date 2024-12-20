import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home.component';
import { FeaturedBlogsComponent } from './featured-blogs/featured-blogs.component';
import { TranslateModule } from '@ngx-translate/core';
import { ProjectsNoRoutesModule } from '../projects/projectsNoRoutes.module';
import { PollItemsNoRoutesModule } from '../polls/poll-items-no-routes.module';
export const routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'  }
];

@NgModule({
  declarations: [
    HomeComponent,
    FeaturedBlogsComponent
  ],
  imports: [
    CommonModule,
    TranslateModule,
    ProjectsNoRoutesModule,
    PollItemsNoRoutesModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class HomeModule { }
