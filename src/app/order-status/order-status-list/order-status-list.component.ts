import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.services';
import { APIService } from '../../services/api.services';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-order-status-list',
  templateUrl: './order-status-list.component.html',
  styleUrls: ['./order-status-list.component.scss'],
})
export class OrderStatusListComponent implements OnInit {

  mobileNumber = null;
  ordersList = [];

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService,
              private authService: AuthService, private router: Router) { }

  ngOnInit() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.utilitiesService.showLoading();
      this.getAcrionCallNumber();
    }
  }

  getAcrionCallNumber() {
    this.apiService.get('API_status/onactioncall').subscribe((response: any) => {
      this.mobileNumber = response;
      this.getOrderList();
    }, () => this.utilitiesService.dismissLoading());
  }

  getOrderList(event?) {
    const mobNumber = this.authService.getMobileNumber;
    this.apiService.get('API_status/index/' + mobNumber).subscribe((response: any) => {
      this.ordersList = response;
      if (event) {
        event.target.complete();
      } else {
        this.utilitiesService.dismissLoading();
      }
    }, () => {
      if (event) {
        event.target.complete();
      } else {
        this.utilitiesService.dismissLoading();
      }
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
}
