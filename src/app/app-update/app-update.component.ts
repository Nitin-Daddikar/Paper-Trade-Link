import { Component } from '@angular/core';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Market } from '@ionic-native/market/ngx';

@Component({
  selector: 'app-app-update',
  templateUrl: 'app-update.component.html',
  styleUrls: ['app-update.component.scss']
})
export class AppUpdateComponent {

  constructor(private appVersion: AppVersion, private market: Market) {
  }

  updateApp() {
    this.appVersion.getPackageName().then(res => {
      this.market.open(res);
    });
  }

}
