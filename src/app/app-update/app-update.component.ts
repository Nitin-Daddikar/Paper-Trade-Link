import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Market } from '@ionic-native/market/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { UtilitiesService } from '../services/utilities.services';

@Component({
  selector: 'app-app-update',
  templateUrl: 'app-update.component.html',
  styleUrls: ['app-update.component.scss']
})
export class AppUpdateComponent {

  constructor(private appVersion: AppVersion, private market: Market, private iab: InAppBrowser, private utilitiesService: UtilitiesService) {
  }

  updateApp() {
    if (this.utilitiesService.updateURL) {
      this.iab.create(this.utilitiesService.updateURL, '_system', 'location=yes');
    } else {
      this.appVersion.getPackageName().then(res => {
        this.market.open(res);
      });
    }
  }

}
