import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Market } from '@ionic-native/market/ngx';

import { AppUpdateComponent } from './app-update.component';

const routes: Routes = [
    {
      path: '',
      component: AppUpdateComponent,
    }
];

@NgModule({
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [AppUpdateComponent],
  providers: [Market]
})
export class AppUpdateModule {}
