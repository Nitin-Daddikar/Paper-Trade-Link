import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.services';
import { APIService } from '../../services/api.services';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-order-status-view',
  templateUrl: './order-status-view.component.html',
  styleUrls: ['./order-status-view.component.scss'],
})
export class OrderStatusViewComponent implements OnInit {

  orderId;
  ordersDetailsList = [];
  mobileNumber;

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService,
              private activatedRoute: ActivatedRoute, private screenshot: Screenshot, private socialSharing: SocialSharing) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.orderId = params.get('orderId');
      this.getActionCallNumber();
    });
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
    this.utilitiesService.shareScreenshot();
  }
}
