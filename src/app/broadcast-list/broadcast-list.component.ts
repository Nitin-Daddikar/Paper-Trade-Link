import { Component, OnInit } from '@angular/core';
import { UtilitiesService } from '../services/utilities.services';
import { APIService } from '../services/api.services';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-broadcast-list',
  templateUrl: './broadcast-list.component.html',
  styleUrls: ['./broadcast-list.component.scss'],
})
export class BroadCastListComponent implements OnInit {

  mobileNumber = null;

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService,
              private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.getActionCallNumber();
  }

  getActionCallNumber() {
    this.utilitiesService.showLoading();
    this.apiService.get('API_status/onactioncall').subscribe((response: any) => {
      this.mobileNumber = response;
      this.utilitiesService.dismissLoading();
    }, () => this.utilitiesService.dismissLoading());
  }

  callNumber() {
    window.open('tel:' + this.mobileNumber, '_system');
  }

  doRefresh(event) {
    setTimeout(() => {
      event.target.complete();
    }, 2000);
  }
}
