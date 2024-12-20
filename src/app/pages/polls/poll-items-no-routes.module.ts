import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AgmCoreModule } from '@agm/core';
import { MatVideoModule } from 'mat-video';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PollItemComponent } from './poll-item/poll-item.component';
import { PollItemsComponent } from './poll-items.component';

@NgModule({
  declarations: [
    PollItemsComponent,
    PollItemComponent
  ],
  exports: [
    PollItemsComponent,
  ],
  imports: [
    CommonModule,
    TranslateModule,
    AgmCoreModule,
    MatVideoModule,
    SharedModule
  ]
})
export class PollItemsNoRoutesModule { }
