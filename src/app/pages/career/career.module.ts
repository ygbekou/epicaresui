import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { CareerComponent } from './career.component';

export const routes = [
  { path: '', component:CareerComponent, pathMatch: 'full'  }
];

@NgModule({
  declarations: [CareerComponent],
  imports: [
    CommonModule,
    TranslateModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class CareerModule { }
