import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { RegisterComponent } from './register.component';
import { TranslateModule } from '@ngx-translate/core';

export const routes = [
  { path: '', component: RegisterComponent, pathMatch: 'full'  }
];

@NgModule({
  declarations: [RegisterComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TranslateModule
  ]
})
export class RegisterModule { }
