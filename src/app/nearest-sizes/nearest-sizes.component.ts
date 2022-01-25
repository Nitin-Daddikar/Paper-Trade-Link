import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UtilitiesService } from '../services/utilities.services';
import { APIService } from '../services/api.services';
import { AuthService } from '../services/auth.service';
import { Screenshot } from '@ionic-native/screenshot/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
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
  product_group: any;
  listProducts = [];
	headers : any = {};
  headersKeys : any = [];
  headersWidth = {};

  searchResult = null;
  ascSort = true;
  sortCol = '';

  loadPage = false;

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService,  private activatedRoute: ActivatedRoute, private socialSharing: SocialSharing, 
    private authService: AuthService, private cdr: ChangeDetectorRef, private router: Router, private screenshot: Screenshot) { }

  ngOnInit() {
    this.activatedRoute.paramMap.subscribe(params => {
      if (this.utilitiesService.isInternatConnectionAvailable()) {
        const length = params.get('length');
        if (length !== undefined && length !== null && length !== '') {
          this.length = +length;
          this.width = +params.get('width');
          this.gsm = +params.get('gsm');
          this.product_group = params.get('product_group');
          this.cdr.detectChanges();
          this.loadMasters();
          this.search();
        } else {
          this.loadMasters();
        }
      }
    });
  }

  loadMasters() {
    this.listProducts = [];
    this.apiService.get('API_search/getMasters')
    .subscribe((response: any) => {
      if (response && response.data) {
        this.listProducts = response.data.product_group;
        this.loadPage = true;
        this.cdr.detectChanges();
      } 
    }, () => {
      this.loadPage = true;
      this.cdr.detectChanges();
    });
  }

  search() {
    if (this.product_group != undefined && this.product_group != null && this.product_group != '') {
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
          if (this.product_group) {
            formData.append('product_group', this.product_group);
          }
          formData.append('customer_id', customerId);

          this.apiService.post('API_search/search_dynamic_column_wise', formData)
          .subscribe((data: any) => {
            if (!_.isEmpty(data) && !_.isEmpty(data.data) && data.data.stock_access != undefined && data.data.stock_access != 1) {
              if (!_.isEmpty(data.data.list)) {
                this.headers = data.headers;
                this.headersWidth = data.headers_width;
                this.headersKeys = Object.keys(data.headers);
                // this.sortKey = this.headersKeys[0];
                this.headersKeys.forEach(element => {
                  this.search[element] = '';
                });
                this.searchResult = data.data.list;
                this.searchResult.map(company => {
                  this.headersKeys.forEach(element => {
                    company[element] = ''+company[element];
                  });
                })
              } else {
                this.searchResult = [];
              }
              // this.searchResult = _.sortBy(this.searchResult, [function(o) { return o[this.sortKey] }.bind(this)]);
              // this.companies = _.cloneDeep(this.allCompanies);
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
    } else {
      this.utilitiesService.presentErrorAlert('Error', 'Please Select Product Group.');
    }
  }

  changeSort(sortCol) {
    console.log('1');
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
