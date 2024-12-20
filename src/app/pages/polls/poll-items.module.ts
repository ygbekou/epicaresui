import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { MatVideoModule } from 'mat-video';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PollItemComponent } from './poll-item/poll-item.component';
import { PollItemsComponent } from './poll-items.component';
import { PollItemsNoRoutesModule } from './poll-items-no-routes.module';

export const routes = [
  { path: '', component: PollItemsComponent, pathMatch: 'full' },
  { path: ':id', component: PollItemComponent }
];

@NgModule({
  declarations: [
  ],
  exports: [
  ],
  imports: [
    CommonModule,
    TranslateModule,
    PollItemsNoRoutesModule,
    RouterModule.forChild(routes),
    AgmCoreModule,
    MatVideoModule,
    SharedModule
  ]
})
export class PollItemsModule { }
