import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Sim } from '@ionic-native/sim/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { APIService } from './services/api.services';
import { UtilitiesService } from './services/utilities.services';
import { SharedModule } from './services/shared.module';
import { AuthService } from './services/auth.service';

@NgModule({
  declarations: [
    AppComponent
  ],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule,
    HttpClientModule,
    SharedModule
  ],
  providers: [
    StatusBar,
    APIService,
    UtilitiesService,
    AuthService,
    Network,
    NativeStorage,
    Sim,
    AppVersion,
    Screenshot,
    SocialSharing
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
