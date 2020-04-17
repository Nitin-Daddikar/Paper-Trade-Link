import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: 'paper-weight-calc', pathMatch: 'full' },
  { path: 'paper-weight-calc',
    loadChildren: () => import('./paper-weight-calc/paper-weight-calc.module').then( m => m.PaperWeightCalcModule)
  },
  { path: 'bank-details',
    loadChildren: () => import('./bank-details/bank-details.module').then( m => m.BankDetailsModule)
  },
  { path: 'contact-us',
    loadChildren: () => import('./contact-us/contact-us.module').then( m => m.ContactUsModule)
  },
  { path: 'login',
    loadChildren: () => import('./login/login.module').then( m => m.LoginModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
