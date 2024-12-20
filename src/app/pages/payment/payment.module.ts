import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { MatVideoModule } from 'mat-video';
import { SharedModule } from '../../shared/shared.module';
import { TranslateModule } from '@ngx-translate/core';
import { PaymentComponent } from './payment.component';
import { FormsModule } from '@angular/forms';

export const routes = [
  { path: '', component: PaymentComponent, pathMatch: 'full' }
];

@NgModule({
  declarations: [
    PaymentComponent
  ],
  exports: [
    PaymentComponent,
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
export class PaymentModule { }
