import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { AboutComponent } from './about.component';
import { TranslateModule } from '@ngx-translate/core';

export const routes = [
  { path: '', component: AboutComponent, pathMatch: 'full'  }
];

@NgModule({
  declarations: [AboutComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class AboutModule { }
