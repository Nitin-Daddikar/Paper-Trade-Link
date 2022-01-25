import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.services';
import { APIService } from '../../services/api.services';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';

@Component({
  selector: 'app-order-status-list',
  templateUrl: './order-status-list.component.html',
  styleUrls: ['./order-status-list.component.scss'],
})
export class OrderStatusListComponent implements OnInit {

  mobileNumber = null;
  ordersList = [];

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService,
    private authService: AuthService, private router: Router, private screenshot: Screenshot, private socialSharing: SocialSharing) { }

  ngOnInit() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.utilitiesService.showLoading();
      this.getActionCallNumber();
    }
  }

  getActionCallNumber() {
    this.apiService.get('API_status/onactioncall').subscribe((response: any) => {
      this.mobileNumber = response;
      this.getOrderList();
    }, () => this.utilitiesService.dismissLoading());
  }

  getOrderList(event?) {
    const mobNumber = this.authService.getMobileNumber;
    this.apiService.get('API_status/get_challan_list?mobile=' + mobNumber).subscribe((response: any) => {
      if (event) {
        event.target.complete();
      } else {
        this.utilitiesService.dismissLoading();
      }

      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        this.ordersList = response.data;
      } else {
        this.utilitiesService.dismissLoading();
      }

    }, () => {
      if (event) {
        event.target.complete();
      } else {
        this.utilitiesService.dismissLoading();
      }
      this.utilitiesService.dismissLoading();
    });
  }

  openOrder(order) {
    this.router.navigate(['/order-status/view/' + order.challan_no]);
  }

  doRefresh(event) {
    this.getOrderList(event);
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
}
