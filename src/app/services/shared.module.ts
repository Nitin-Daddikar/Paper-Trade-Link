import { NgModule } from '@angular/core';
import { TranslatePipe } from './translate.pipe';

const EXPORTS = [
    TranslatePipe
];

@NgModule({
  declarations: [
    EXPORTS
  ],
  exports: [
    EXPORTS
  ]
})
export class SharedModule { }
