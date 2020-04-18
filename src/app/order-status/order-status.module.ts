import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderStatusViewComponent } from './order-status-view/order-status-view.component';
import { OrderStatusListComponent } from './order-status-list/order-status-list.component';

@NgModule({
  declarations: [
    OrderStatusViewComponent,
    OrderStatusListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: OrderStatusListComponent
      },
      {
        path: 'view/:orderId',
        component: OrderStatusViewComponent
      }
    ])
  ]
})
export class OrderStatusModule { }
