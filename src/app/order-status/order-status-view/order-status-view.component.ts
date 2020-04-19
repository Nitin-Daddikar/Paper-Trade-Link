import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../../services/utilities.services';
import { APIService } from '../../services/api.services';
import { AuthService } from '../../services/auth.service';
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
              private authService: AuthService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      this.orderId = params.get('orderId');
      this.getAcrionCallNumber();
    });
  }

  getAcrionCallNumber() {
    this.utilitiesService.showLoading();
    this.apiService.get('API_status/onactioncall').subscribe((response: any) => {
      this.mobileNumber = response;
      this.getOrderDetail();
    }, () => this.utilitiesService.dismissLoading());
  }

  getOrderDetail() {
    this.apiService.get('API_status/detials/' + this.orderId).subscribe((response: any) => {
      this.ordersDetailsList = response;
      this.utilitiesService.dismissLoading();
    }, () => this.utilitiesService.dismissLoading());
  }

  callNumber() {
    window.open('tel:' + this.mobileNumber, '_system');
  }
}
