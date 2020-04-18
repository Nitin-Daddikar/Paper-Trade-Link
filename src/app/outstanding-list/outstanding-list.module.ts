import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { OutstandingListComponent } from './outstanding-list.component';

@NgModule({
  declarations: [
    OutstandingListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: OutstandingListComponent
      }
    ])
  ]
})
export class OutstandingListModule { }
