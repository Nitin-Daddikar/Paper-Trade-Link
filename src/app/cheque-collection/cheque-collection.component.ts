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
  companyName = '';
  amount;
  remark = 'Please collect cheque from';

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService,
              private authService: AuthService) { }

  ngOnInit() {
    this.getCompanyList();
  }

  getCompanyList() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.companyList = [];
      this.utilitiesService.showLoading();
      const mobileNumber = this.authService.getMobileNumber;
      this.apiService.get('API_addorder/find_company_list?mobile=' + mobileNumber).subscribe((response: any) => {
        this.utilitiesService.dismissLoading();
        if (response && response.data) {
          this.companyList = response.data;
        } else {
          this.utilitiesService.presentErrorAlert();
        }
      }, () => {
        this.utilitiesService.dismissLoading();
        this.utilitiesService.presentErrorAlert();
      });
    }
  }

  submitCollection() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      if (this.companyName && this.companyName != '' && this.companyName.length > 0 && this.amount && this.amount > 0) {
        const mobNumber = this.authService.getMobileNumber;
        const customerId = this.authService.getCustomerId;

        const formData = new FormData();
        formData.append('company_name', this.companyName);
        formData.append('mobile', mobNumber);
        formData.append('amount', this.amount);
        formData.append('remark', this.remark);
        formData.append('customer_id', customerId);

        this.utilitiesService.showLoading();
        this.apiService.post('API_Cheque_collect/collect_cheque', formData).subscribe((res: any) => {
          this.utilitiesService.dismissLoading();
          if (res && res.data) {
            this.utilitiesService.presentErrorAlert('Success', 'Cheque collection submitted successfully.');
            this.resetForm();
          } else {
            this.utilitiesService.presentErrorAlert('Oops !', 'Cheque collection is failed. Try again.');
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
    this.amount = null;
    this.remark = '';
  }
}
