import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../services/utilities.services';
import { APIService } from '../services/api.services';
import { AuthService } from '../services/auth.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-nearest-sizes',
  templateUrl: './nearest-sizes.component.html',
  styleUrls: ['./nearest-sizes.component.scss'],
})
export class NearestSizesComponent implements OnInit {

  length: any;
  width: any;
  gsm: any;
  productID: any;
  listProducts = [];

  searchResult = null;
  ascSort = true;
  sortCol = '';

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService,  private activatedRoute: ActivatedRoute,
              private authService: AuthService, private cdr: ChangeDetectorRef, private router: Router) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (this.utilitiesService.isInternatConnectionAvailable()) {
        const length = params.get('length');
        if (length !== undefined && length !== null && length !== '') {
          this.loadMasters(false);
          this.length = +length;
          this.width = +params.get('width');
          this.gsm = +params.get('gsm');
          this.search();
        } else {
          this.loadMasters();
        }
      }
    });
  }

  loadMasters(showLoader = true) {
    this.listProducts = [];
    this.apiService.get('API_search/getMasters')
    .subscribe((response: any) => {
      if (response && response.data) {
        this.listProducts = response.data.product_group;
        this.cdr.detectChanges();
      } 
    }, () => {
    });
  }

  search() {
    if (this.length && this.width && this.gsm && this.length > 0 && this.width > 0 && this.gsm > 0) {
      if (this.utilitiesService.isInternatConnectionAvailable()) {
        this.searchResult = null;
        this.ascSort = true;
        this.sortCol = '';
        this.utilitiesService.showLoading();
        const customerId = this.authService.getCustomerId;

        const formData = new FormData();
        formData.append('length', this.length);
        formData.append('width', this.width);
        formData.append('gsm', this.gsm);
        if (this.productID) {
          formData.append('product_group', this.productID);
        }
        formData.append('customer_id', customerId);

        this.apiService.post('API_search/search_new', formData)
        .subscribe((response: any) => {
          if (response && response.data && response.data.stock_access != undefined && response.data.stock_access != 1) {
            this.searchResult = response.data.list;
            this.cdr.detectChanges();
          } else {
            this.utilitiesService.presentErrorAlert();
          }
          this.utilitiesService.dismissLoading();
        }, () => {
          this.utilitiesService.presentErrorAlert();
          this.utilitiesService.dismissLoading();
        });
      }
    } else {
      this.utilitiesService.presentErrorAlert('Error', 'Length, Width and GSM can\'t be empty and less than or equal to zero.');
    }
  }

  changeSort(sortCol) {
    this.ascSort = !this.ascSort;
    this.sortCol = sortCol;
    this.searchResult = _.orderBy(this.searchResult, this.sortCol, this.ascSort ? 'asc' : 'desc');
  }

  reverse() {
    this.ascSort = true;
    this.sortCol = '';
    const oldLen = this.length;
    this.length = this.width;
    this.width = oldLen;
    this.search();
  }

  orderNow(res) {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.router.navigate(['/place-order/' + res.id]);
    }
  }
}
