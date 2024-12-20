import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { MatVideoModule } from 'mat-video';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { LeadershipComponent } from './leadership.component';

export const routes = [
  { path: '', component: LeadershipComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    LeadershipComponent
  ],
  exports: [
    LeadershipComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes),
    AgmCoreModule,
    MatVideoModule,
    SharedModule,
    FormsModule
  ]
})
export class LeadershipModule { }
