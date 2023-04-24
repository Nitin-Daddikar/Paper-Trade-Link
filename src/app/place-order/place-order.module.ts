import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { PlaceOrderComponent } from './place-order.component';

@NgModule({
  declarations: [
    PlaceOrderComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: ':id/:company',
        component: PlaceOrderComponent
      },
      {
        path: ':length/:width/:gsm',
        component: PlaceOrderComponent
      }
    ])
  ]
})
export class PlaceOrderModule { }
