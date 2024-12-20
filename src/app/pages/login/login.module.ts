import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { LoginComponent } from './login.component';
import { TranslateModule} from '@ngx-translate/core';
export const routes = [
  { path: '', component: LoginComponent, pathMatch: 'full'  }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
    TranslateModule
  ]
})
export class LoginModule { }
