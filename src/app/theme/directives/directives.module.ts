import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OnlyNumberDirective } from './only-number.directive';
// import { PasswordMatcher } from './password-matcher.directive';

@NgModule({
  declarations: [
    OnlyNumberDirective
  ],
  exports: [
    OnlyNumberDirective
  ],
  imports: [
    CommonModule
  ]
})
export class DirectivesModule { }
