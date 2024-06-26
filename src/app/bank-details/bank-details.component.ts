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
  qr_code_details = null;

  constructor(private apiService: APIService, private utilitiesService: UtilitiesService) { }

  ngOnInit() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.utilitiesService.showLoading();
      this.apiService.get('API_bank/bank_details').subscribe((response: any) => {
        if (response && response.data && response.data.bank_details) {
          this.bankDetails = response.data.bank_details;
          this.qr_code_details = response.data.qr_code_details;
        } else {
          this.utilitiesService.presentErrorAlert();
        }
        this.utilitiesService.dismissLoading();
      });
    }
  }
}
