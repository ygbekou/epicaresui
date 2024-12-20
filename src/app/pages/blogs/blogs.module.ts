import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { MatVideoModule } from 'mat-video';
import { SharedModule } from '../../shared/shared.module';
import { BlogsComponent } from './blogs.component';
import { BlogComponent } from './blog/blog.component';
import { TranslateModule } from '@ngx-translate/core';

export const routes = [
  { path: '', component: BlogsComponent, pathMatch: 'full' },
  { path: ':id', component: BlogComponent }
];

@NgModule({
  declarations: [
    BlogsComponent,
    BlogComponent
  ],
  exports: [
    BlogsComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes),
    AgmCoreModule,
    MatVideoModule,
    SharedModule
  ]
})
export class BlogsModule { }
