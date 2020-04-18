import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../services/utilities.services';
import { APIService } from '../services/api.services';
import { AuthService } from '../services/auth.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-cheque-collection',
  templateUrl: './cheque-collection.component.html',
  styleUrls: ['./cheque-collection.component.scss'],
})
export class ChequeCollectionComponent implements OnInit {

  companyList = [];

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService,
              private authService: AuthService) { }

  ngOnInit() {
    this.getCompanyList();
  }

  getCompanyList() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.companyList = [];
      this.utilitiesService.showLoading();
      const mobNumber = this.authService.getMobileNumber;
      this.apiService.get('API_addorder/company_name/' + mobNumber).subscribe((response: any) => {
        this.companyList = response;
        this.utilitiesService.dismissLoading();
      }, () => {
        this.utilitiesService.presentErrorAlert();
        this.utilitiesService.dismissLoading();
      });
    }
  }
}
