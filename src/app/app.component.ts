import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { APIService } from './services/api.services';
import { UtilitiesService } from './services/utilities.services';

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
    private utilitiesService: UtilitiesService
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
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  openFeedback() {
    window.open('https://play.google.com/store/apps/details?id=com.ionicframework.test199784&hl=en', '_system', 'location=yes');
    return false;
  }
}
