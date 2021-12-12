import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NearestSizesComponent } from './nearest-sizes.component';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@NgModule({
  declarations: [
    NearestSizesComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    FormsModule,
    RouterModule.forChild([
      {
        path: '',
        component: NearestSizesComponent
      },
      {
        path: ':length/:width/:gsm/:product_group',
        component: NearestSizesComponent
      }
    ])
  ],
  providers: [Screenshot, SocialSharing],
  exports: [NearestSizesComponent]
})
export class NearestSizesModule { }
