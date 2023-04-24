import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
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

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService, private cdr: ChangeDetectorRef,
              private authService: AuthService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (this.utilitiesService.isInternatConnectionAvailable()) {
        const id = params.get('id');
        const company = params.get('company');
        if (id === undefined || id === null) {
          this.length = params.get('length');
          this.width = params.get('width');
          this.gsm = params.get('gsm');
          this.cdr.detectChanges();
          this.utilitiesService.showLoading();
          this.getCompanyList();
        } else {
          this.getStockDetail(id, company);
        }
      }
    });
  }

  getStockDetail(id, company) {
    this.utilitiesService.showLoading();
    this.apiService.get('API_search/GetStockdetail?stock_id=' + id + '&company=' + company).subscribe((response: any) => {
      if (response && response.data) {
        const stockDetail = response.data;
        this.quality = stockDetail.quality;
        this.length = stockDetail.size_inch_length;
        this.width = stockDetail.size_inch_width;
        this.gsm = stockDetail.gsm;
        this.cdr.detectChanges();
        this.getCompanyList();
      } else {
        this.utilitiesService.dismissLoading();
        this.utilitiesService.presentErrorAlert();
      }
    }, () => {
      this.utilitiesService.dismissLoading();
      this.utilitiesService.presentErrorAlert();
    });
  }

  getCompanyList() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.companyList = [];
      const mobileNumber = this.authService.getMobileNumber;
      this.apiService.get('API_addorder/find_company_list?mobile=' + mobileNumber).subscribe((response: any) => {
        this.utilitiesService.dismissLoading();
        if (response && response.data) {
          this.companyList = response.data;
        } else {
          this.utilitiesService.presentErrorAlert();
        }
        this.cdr.detectChanges();
      }, () => {
        this.utilitiesService.dismissLoading();
        this.utilitiesService.presentErrorAlert();
      });
    }
  }

  submitOrder() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      if (this.companyName) {
        this.utilitiesService.showLoading();

        const formData = new FormData();
        formData.append('customer_id', this.companyName);
        formData.append('len', this.length);
        formData.append('wed', this.width);
        formData.append('qual', this.quality);
        formData.append('gsm', this.gsm);
        formData.append('qty', this.noOfSheet);
        formData.append('deliv', this.delivery);

        this.apiService.post('API_addorder/add_order', formData).subscribe((res: any) => {
          this.utilitiesService.dismissLoading();
          if (res && res.data) {
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
