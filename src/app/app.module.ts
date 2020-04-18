import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Network } from '@ionic-native/network/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

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
    SplashScreen,
    APIService,
    UtilitiesService,
    AuthService,
    Network,
    NativeStorage
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
