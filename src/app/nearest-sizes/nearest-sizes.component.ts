import { Component, OnInit } from '@angular/core';
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
  gsm: any

  searchResult = null;
  ascSort = true;
  sortCol = 'quality';

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService,
              private authService: AuthService) { }

  ngOnInit() {}

  search() {
    if (this.length && this.width && this.gsm && this.length > 0 && this.width > 0 && this.gsm > 0) {
      if (this.utilitiesService.isInternatConnectionAvailable()) {
        this.searchResult = null;
        this.utilitiesService.showLoading();
        const mobNumber = this.authService.getMobileNumber;
        this.apiService.get('API_search/search_new/' + this.length + '/' + this.width + '/' + mobNumber + '/' + this.gsm)
        .subscribe((response: any) => {
          if (response && response.stock_access != undefined && response.stock_access != 1) {
            this.searchResult = response.list;
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

  changeSort(sortCol?) {
    this.ascSort = !this.ascSort;
    if (sortCol) {
      this.sortCol = sortCol;
    }
    this.searchResult = _.orderBy(this.searchResult, this.sortCol, this.ascSort ? 'asc' : 'desc');
  }
}
