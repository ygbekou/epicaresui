import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { VotesComponent } from './votes.component';
import { VoteComponent } from './vote/vote.component';
import { TranslateModule } from '@ngx-translate/core';

export const routes = [
  { path: '', component: VotesComponent, pathMatch: 'full' },
  { path: ':id', component: VoteComponent }
];

@NgModule({
  declarations: [
    VotesComponent,
    VoteComponent
  ],
  imports: [
    CommonModule,TranslateModule,
    RouterModule.forChild(routes),
    SharedModule
  ]
})
export class VotesModule { }
