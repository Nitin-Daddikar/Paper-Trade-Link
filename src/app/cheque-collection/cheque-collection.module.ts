import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ChequeCollectionComponent } from './cheque-collection.component';

@NgModule({
  declarations: [
    ChequeCollectionComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: ChequeCollectionComponent
      }
    ])
  ]
})
export class ChequeCollectionModule { }
