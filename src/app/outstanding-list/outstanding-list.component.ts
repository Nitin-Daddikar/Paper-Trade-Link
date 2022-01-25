import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../services/utilities.services';
import { APIService } from '../services/api.services';
import { AuthService } from '../services/auth.service';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx'

@Component({
  selector: 'app-outstanding-list',
  templateUrl: './outstanding-list.component.html',
  styleUrls: ['./outstanding-list.component.scss'],
})
export class OutstandingListComponent implements OnInit {

  companyResult = null;

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService,
    private authService: AuthService, private screenshot: Screenshot, private socialSharing: SocialSharing) { }

  ngOnInit() {
    this.getDetails();
  }

  getDetails(event = null) {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.companyResult = null;
      if (!event) {
        this.utilitiesService.showLoading();
      }
      const mobNumber = this.authService.getMobileNumber;
      this.apiService.get('API_outstand/company?mobile=' + mobNumber).subscribe((response: any) => {
        if (event) {
          event.target.complete();
        } else {
          this.utilitiesService.dismissLoading();
        }

        if (response && response.data) {
          this.companyResult = response.data;
        } else {
          this.utilitiesService.presentErrorAlert();
        }
      }, () => {
        if (event) {
          event.target.complete();
        } else {
          this.utilitiesService.dismissLoading();
        }
        this.utilitiesService.presentErrorAlert();
      });
    }
  }

  doRefresh(event) {
    this.getDetails(event);
  }
  shareScreenshot() {
    this.screenshot.URI(80).then((uri) => {
      this.socialSharing.share('', '', uri.URI);
    }, (e) => {
      if (e == 20) {
        this.utilitiesService.presentErrorAlert('Error', 'Please allow storage permission from settings to share screenshot.');
      }
    });
  }
}
