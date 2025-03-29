import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.services';
import { APIService } from '../../services/api.services';
import { ActivatedRoute } from '@angular/router';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-order-status-view',
  templateUrl: './order-status-view.component.html',
  styleUrls: ['./order-status-view.component.scss'],
})
export class OrderStatusViewComponent implements OnInit {

  orderId;
  ordersDetailsList = [];
  mobileNumber;
  showDownloadInvoiceOption = null;
  showDownloadChallanOption = null;

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService, private iab: InAppBrowser,
              private activatedRoute: ActivatedRoute, private screenshot: Screenshot, private socialSharing: SocialSharing) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.orderId = params.get('orderId');
      this.getActionCallNumber();
      this.getOptions();
    });
  }

  getOptions() {
    this.showDownloadInvoiceOption = null;
    this.apiService.get('API_status/option_masters').subscribe((res: any) => {
      const options = res.data;
      if (options) {
        options.forEach(option => {
          if (option.option == 'show_download_invoice_button' && option.value && option.value.trim().toLowerCase() == 'yes') {
            this.showDownloadInvoiceOption = option.value;
          }
          if (option.option == 'show_download_challan_copy_button' && option.value && option.value.trim().toLowerCase() == 'yes') {
            this.showDownloadChallanOption = option.value;
          }
        });
      }
    }, () => {});
  }

  getActionCallNumber() {
    this.utilitiesService.showLoading();
    this.apiService.get('API_status/onactioncall').subscribe((response: any) => {
      this.mobileNumber = response;
      this.getOrderDetail();
    }, () => this.utilitiesService.dismissLoading());
  }

  getOrderDetail() {
    this.apiService.get('API_status/detials?challan_no=' + this.orderId).subscribe((response: any) => {
      this.utilitiesService.dismissLoading();
      if (response && response.data) {
        this.ordersDetailsList = response.data;
      } else {
        this.utilitiesService.presentErrorAlert();
      }
    }, () => this.utilitiesService.dismissLoading());
  }

  callNumber() {
    window.open('tel:' + this.mobileNumber, '_system');
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

  downloadPdf(url) {
    this.iab.create(url, '_system', 'location=yes');
  }

  isShowChallanCopy() {
    return this.showDownloadChallanOption && this.ordersDetailsList && this.ordersDetailsList.length > 0 && this.ordersDetailsList[0].pdf_url
  }

  isShowInvoice() {
    return this.showDownloadInvoiceOption && this.ordersDetailsList && this.ordersDetailsList.length > 0 && this.ordersDetailsList[0].pdf_invoice
  }
}
