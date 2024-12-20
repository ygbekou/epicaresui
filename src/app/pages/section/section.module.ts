import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { SectionComponent } from './section.component';
import { TranslateModule } from '@ngx-translate/core';

export const routes = [
  { path: '', component: SectionComponent, pathMatch: 'full'  }
];

@NgModule({
  declarations: [SectionComponent],
  imports: [
    CommonModule,TranslateModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class SectionModule { }
