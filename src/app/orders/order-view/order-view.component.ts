import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.services';
import { APIService } from '../../services/api.services';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ActivatedRoute } from '@angular/router';
import { AlertController, ModalController } from '@ionic/angular';
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
  searchHistoryDetails = null;

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService, private modalController: ModalController,
    private activatedRoute: ActivatedRoute, private screenshot: Screenshot, private socialSharing: SocialSharing, private alertController: AlertController) { }

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
        if (this.ordersDetailsList && this.ordersDetailsList.length > 0) {
          this.getSearchHistory(this.ordersDetailsList[0]["last_searched_id"]);
        }
      } else {
        this.utilitiesService.presentErrorAlert();
      }
    }, () => this.utilitiesService.dismissLoading());
  }

  getSearchHistory(historyId) {
    this.apiService.get('API_status/get_search_history?id=' + historyId).subscribe((response: any) => {
      this.utilitiesService.dismissLoading();
      if (response && response.data) {
        this.searchHistoryDetails = response.data;
      } else {
        this.searchHistoryDetails = null;
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

  async cancelOrder() {
    const alert = await this.alertController.create({
      header: 'Are you sure you want to cancel this order?',
      message: 'You won\'t be able to revert this!',
      buttons: [
        {
          text: 'Close',
          role: 'cancel',
          cssClass: 'secondary'
        }, {
          text: 'Yes, cancel it!',
          handler: () => {
            this.utilitiesService.showLoading();
            const formData = new FormData();
            formData.append('order_id', this.orderId);

            this.apiService.post('API_addorder/cancel_order', formData).subscribe((response: any) => {
              this.utilitiesService.dismissLoading();
              if (response && response.data) {
                this.getOrderDetail();
                this.utilitiesService.showToast("Your order has been cancelled !");
              } else {
                this.utilitiesService.presentErrorAlert();
              }
            }, () => this.utilitiesService.dismissLoading());
          }
        }
      ]
    });
    await alert.present();
  }
}
