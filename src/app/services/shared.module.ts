import { NgModule } from '@angular/core';
import { TranslatePipe } from '../services/translate.service';

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
