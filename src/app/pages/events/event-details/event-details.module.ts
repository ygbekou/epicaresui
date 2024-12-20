import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { MatVideoModule } from 'mat-video';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { EventDetailsComponent } from './event-details.component';

export const routes = [
  { path: '', component: EventDetailsComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    EventDetailsComponent
  ],
  exports: [
    EventDetailsComponent
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
export class EventDetailsModule { }
