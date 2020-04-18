import { Component, OnInit } from '@angular/core';
import { APIService } from '../services/api.services';
import { UtilitiesService } from '../services/utilities.services';

@Component({
  selector: 'app-bank-details',
  templateUrl: './bank-details.component.html',
  styleUrls: ['./bank-details.component.scss'],
})
export class BankDetailsComponent implements OnInit {

  bankDetails = [];

  constructor(private apiService: APIService, private utilitiesService: UtilitiesService) { }

  ngOnInit() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.utilitiesService.showLoading();
      this.apiService.get('API_bank/bank_details').subscribe((bankDetails: any) => {
        if (bankDetails && bankDetails.bank_details) {
          this.bankDetails = bankDetails.bank_details;
        } else {
          this.utilitiesService.presentErrorAlert();
        }
        this.utilitiesService.dismissLoading();
      });
    }
  }
}
