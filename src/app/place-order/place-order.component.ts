import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../services/utilities.services';
import { APIService } from '../services/api.services';
import { AuthService } from '../services/auth.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss'],
})
export class PlaceOrderComponent implements OnInit {

  companyList = [];
  companyName = '';
  quality = '';
  length;
  width;
  gsm;
  noOfSheet;
  delivery = '';

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService,
              private authService: AuthService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (this.utilitiesService.isInternatConnectionAvailable()) {
        const id = params.get('id');
        this.getStockDetail(id);
      }
    });
  }

  getStockDetail(id) {
    this.utilitiesService.showLoading();
    this.apiService.get('API_search/GetStockdetail/' + id).subscribe((response: any) => {
      const stockDetail = response;
      this.length = stockDetail.size_inch_length;
      this.width = stockDetail.size_inch_width;
      this.gsm = stockDetail.gsm;
      this.quality = stockDetail.quality;
      this.getCompanyList();
    }, () => {
      this.utilitiesService.dismissLoading();
      this.utilitiesService.presentErrorAlert();
    });
  }

  getCompanyList() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.companyList = [];
      const mobNumber = this.authService.getMobileNumber;
      this.apiService.get('API_addorder/company_name/' + mobNumber).subscribe((response: any) => {
        this.companyList = response;
        this.utilitiesService.dismissLoading();
      }, () => {
        this.utilitiesService.dismissLoading();
        this.utilitiesService.presentErrorAlert();
      });
    }
  }

  submitOrder() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      if (this.companyName && this.companyName != '' && this.companyName.length > 0) {
        const mobNumber = this.authService.getMobileNumber;
        const submitParam = {
          mobile: mobNumber,
          cust_name: this.companyName,
          len: this.length,
          wed: this.width,
          qual: this.quality,
          gsm: this.gsm,
          qty: this.noOfSheet,
          deliv: this.delivery
        };

        this.utilitiesService.showLoading();
        this.apiService.post('API_addorder/add_order', submitParam).subscribe((res) => {
          this.utilitiesService.dismissLoading();
          if (res && res > 1) {
            this.utilitiesService.presentErrorAlert('New Order Added', 'Your order is placed successfully.');
            this.resetForm();
          } else {
            this.utilitiesService.presentErrorAlert('New Order failed', 'Your order is failed. Try again.');
          }
        }, () => {
          this.utilitiesService.dismissLoading();
          this.utilitiesService.presentErrorAlert();
        });
      } else {
        this.utilitiesService.presentErrorAlert('Alert', 'Please enter all mandatory fields.');
      }
    }
  }

  resetForm() {
    this.companyName = '';
    this.quality = '';
    this.length = null;
    this.width = null;
    this.gsm = null;
    this.noOfSheet = null;
    this.delivery = '';
  }
}
