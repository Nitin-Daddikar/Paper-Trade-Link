import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BroadCastListComponent } from './broadcast-list.component';

@NgModule({
  declarations: [
    BroadCastListComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: BroadCastListComponent
      }
    ])
  ]
})
export class BroadCastListModule { }
