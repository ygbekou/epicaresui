import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { MatVideoModule } from 'mat-video';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PollDetailsComponent } from './poll-details.component';

export const routes = [
  { path: '', component: PollDetailsComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    PollDetailsComponent
  ],
  exports: [
    PollDetailsComponent
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
export class PollDetailsModule { }
