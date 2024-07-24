import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.services';
import { APIService } from '../../services/api.services';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { ModalController } from '@ionic/angular';
import { OrderQuantityComponent } from '../order-quantity/order-quantity.component';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {

  mobileNumber = null;
  ordersList = [];

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService, private modalController: ModalController,
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
    const customerId = this.authService.getCustomerId;
    this.apiService.get('API_status/get_orders_list?customerId=' + customerId).subscribe((response: any) => {
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
    this.router.navigate(['/orders/view/' + order.id]);
  }

  doRefresh(event) {
    this.getOrderList(event);
  }

  callNumber() {
    window.open('tel:' + this.mobileNumber, '_system');
  }

  shareScreenshot() {
    this.utilitiesService.shareScreenshot();
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
        this.getOrderList();
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
