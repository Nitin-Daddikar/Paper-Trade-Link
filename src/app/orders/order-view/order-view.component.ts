import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.services';
import { APIService } from '../../services/api.services';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ActivatedRoute } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { OrderQuantityComponent } from '../order-quantity/order-quantity.component';

@Component({
  selector: 'app-order-view',
  templateUrl: './order-view.component.html',
  styleUrls: ['./order-view.component.scss'],
})
export class OrderViewComponent implements OnInit {

  orderId;
  ordersDetailsList = [];
  mobileNumber;

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService, private modalController: ModalController,
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
    this.apiService.get('API_status/get_order?id=' + this.orderId).subscribe((response: any) => {
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

  async editQuantity(event, orderDetails) {
    event.stopPropagation();
    const modal = await this.modalController.create({
      component: OrderQuantityComponent,
      swipeToClose: true,
      componentProps: { orderDetails },
      cssClass: 'edit-quantity'
    });

    modal.onDidDismiss().then(res => {
      if (res.data && res.data.data) {
        this.utilitiesService.presentErrorAlert('Quantity changed successfully !', ' ');
        this.getOrderDetail();
      }
    });

    await modal.present();
  }

  getStatusLabel(status) {
    switch (status.toUpperCase()) {
      case 'B':
        return 'Booked';
      case 'P':
        return 'Pending';
      case 'NS':
        return 'Not In Stock';
      case 'C':
        return 'Cancelled';
      default:
        return 'Unknown';
    }
  }
}
