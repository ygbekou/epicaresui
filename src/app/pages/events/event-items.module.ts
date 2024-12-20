import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { MatVideoModule } from 'mat-video';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { EventItemsComponent } from './event-items.component';
import { EventItemComponent } from './event-item/event-item.component';

export const routes = [
  { path: '', component: EventItemsComponent, pathMatch: 'full' },
  { path: ':id', component: EventItemComponent }
];

@NgModule({
  declarations: [
    EventItemsComponent,
    EventItemComponent
  ],
  exports: [
    EventItemsComponent,
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
export class EventItemsModule { }
