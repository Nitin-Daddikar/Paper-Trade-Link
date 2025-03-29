import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../services/utilities.services';
import { APIService } from '../services/api.services';
import { AuthService } from '../services/auth.service';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-outstanding-list',
  templateUrl: './outstanding-list.component.html',
  styleUrls: ['./outstanding-list.component.scss'],
})
export class OutstandingListComponent implements OnInit {

  companyResult = null;
  showDownloadOption = null;

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService, private iab: InAppBrowser,
              private authService: AuthService, private screenshot: Screenshot, private socialSharing: SocialSharing) { }

  ngOnInit() {
    this.getDetails();
    this.getOptions();
  }

  getOptions() {
    this.showDownloadOption = null;
    this.apiService.get('API_status/option_masters').subscribe((res: any) => {
      const options = res.data;
      if (options) {
        options.forEach(option => {
          if (option.option == 'show_download_invoice_button' && option.value && option.value.trim().toLowerCase() == 'yes') {
            this.showDownloadOption = option.value;
          }
        });
      }
    }, () => {});
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
    this.utilitiesService.shareScreenshot();
  }

  downloadPdf(url) {
    this.iab.create(url, '_system', 'location=yes');
  }
}
