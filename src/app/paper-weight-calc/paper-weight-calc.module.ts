import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PaperWeightCalcComponent } from './paper-weight-calc.component';

@NgModule({
  declarations: [
    PaperWeightCalcComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: PaperWeightCalcComponent
      }
    ])
  ]
})
export class PaperWeightCalcModule { }
