import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OrderViewComponent } from './order-view/order-view.component';
import { OrdersComponent } from './orders/orders.component';
import { OrderQuantityComponent } from './order-quantity/order-quantity.component';

@NgModule({
  declarations: [
    OrderViewComponent,
    OrdersComponent,
    OrderQuantityComponent
  ],
  entryComponents: [OrderQuantityComponent],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      { path: '', redirectTo: 'list', pathMatch: 'full' },
      {
        path: 'list',
        component: OrdersComponent
      },
      {
        path: 'view/:orderId',
        component: OrderViewComponent
      }
    ])
  ]
})
export class OrdersModule { }
