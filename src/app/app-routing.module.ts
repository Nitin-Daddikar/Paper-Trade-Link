import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'paper-weight-calc', pathMatch: 'full' },
  {
    path: 'paper-weight-calc',
    loadChildren: () => import('./paper-weight-calc/paper-weight-calc.module').then(m => m.PaperWeightCalcModule)
  },
  {
    path: 'bank-details',
    loadChildren: () => import('./bank-details/bank-details.module').then(m => m.BankDetailsModule)
  },
  {
    path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then(m => m.ContactUsModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'nearest-sizes',
    loadChildren: () => import('./nearest-sizes/nearest-sizes.module').then(m => m.NearestSizesModule)
  },
  {
    path: 'order-status',
    loadChildren: () => import('./order-status/order-status.module').then(m => m.OrderStatusModule)
  },
  {
    path: 'outstanding-list',
    loadChildren: () => import('./outstanding-list/outstanding-list.module').then(m => m.OutstandingListModule)
  },
  {
    path: 'cheque-collection',
    loadChildren: () => import('./cheque-collection/cheque-collection.module').then(m => m.ChequeCollectionModule)
  },
  {
    path: 'broadcast-list',
    loadChildren: () => import('./broadcast-list/broadcast-list.module').then(m => m.BroadCastListModule)
  },
  {
    path: 'place-order',
    loadChildren: () => import('./place-order/place-order.module').then(m => m.PlaceOrderModule)
  },
  {
    path: 'app-update',
    loadChildren: () => import('./app-update/app-update.module').then(m => m.AppUpdateModule)
  },
  {
    path: 'orders',
    loadChildren: () => import('./orders/orders.module').then(m => m.OrdersModule)
  },
  {
    path: 'cart',
    loadChildren: () => import('./cart/cart.module').then(m => m.CartModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
