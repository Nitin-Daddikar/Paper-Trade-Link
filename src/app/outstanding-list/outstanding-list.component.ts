import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../services/utilities.services';
import { APIService } from '../services/api.services';
import { AuthService } from '../services/auth.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-outstanding-list',
  templateUrl: './outstanding-list.component.html',
  styleUrls: ['./outstanding-list.component.scss'],
})
export class OutstandingListComponent implements OnInit {

  companyResult = null;

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService,
              private authService: AuthService) { }

  ngOnInit() {
    this.getDetails();
  }

  getDetails() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.companyResult = null;
      this.utilitiesService.showLoading();
      const mobNumber = this.authService.getMobileNumber;
      this.apiService.get('API_outstand/company/' + mobNumber).subscribe((response: any) => {
        this.companyResult = response;
        this.utilitiesService.dismissLoading();
      }, () => {
        this.utilitiesService.presentErrorAlert();
        this.utilitiesService.dismissLoading();
      });
    }
  }
}
