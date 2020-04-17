import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BankDetailsComponent } from './bank-details.component';
import { SharedModule } from '../services/shared.module';

@NgModule({
  declarations: [
    BankDetailsComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: BankDetailsComponent
      }
    ]),
    SharedModule
  ],
  providers: [
  ]
})
export class BankDetailsModule { }
