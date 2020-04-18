import { Component } from '@angular/core';

import { Platform, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { APIService } from './services/api.services';
import { UtilitiesService } from './services/utilities.services';
import { AuthService } from './services/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private apiService: APIService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
    private navCtrl: NavController,
    private storage: NativeStorage
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getLabels();
    });
  }

  getLabels() {
    this.apiService.get('API_labels/labels').subscribe((labels: any) => {
      if (labels) {
        this.utilitiesService.setLabels(labels);
      }
    }, () => {},
    () => {

      if (this.utilitiesService.isCordovaAvailable()) {
        this.storage.getItem('mobileNumber').then(
          mobileNumber => {
            alert('back mob')
            if (mobileNumber) {
              alert('mob')
              this.authService.setMobileNumber = mobileNumber;
              this.storage.getItem('stockAccess').then(
                stockAccess => {
                  this.authService.setstockAccess = stockAccess;
                  this.storage.getItem('isLoggedIn').then(
                    isLoggedIn => {
                      this.authService.UserLoggedIn = isLoggedIn;
                      this.statusBar.styleDefault();
                      this.splashScreen.hide();
                    }
                  );
                }
              );
            }
          }
        );
      } else {
        // Nitin temp
        // this.authService.setMobileNumber = '9699814688';
        // this.authService.setstockAccess = 0;
        // this.authService.UserLoggedIn = true;
        // this.statusBar.styleDefault();
        // this.splashScreen.hide();
      }

    });
  }

  get isUserLoggedIn() {
    return this.authService.isUserLoggedIn;
  }

  openFeedback() {
    window.open('https://play.google.com/store/apps/details?id=com.ionicframework.test199784&hl=en', '_system', 'location=yes');
    return false;
  }

  logout() {
    this.authService.logOutUser();
    this.navCtrl.navigateRoot('/paper-weight-calc');
  }
}
