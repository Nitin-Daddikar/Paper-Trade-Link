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

  notifications = [];
  mobileNumber = null;

  constructor(private utilitiesService: UtilitiesService, private apiService: APIService,
              private authService: AuthService, private router: Router) { }

  ngOnInit() {
    this.getNotifications();
  }

  getNotifications(refreshList = null) {
    if (!refreshList) {
      this.utilitiesService.showLoading();
    }
    const mobNumber = this.authService.getMobileNumber;
    this.apiService.get('API_notification/push_notification_list/' + mobNumber).subscribe((response: any) => {
      this.notifications = response;
      if (refreshList) {
        refreshList.target.complete();
      } else {
        this.getActionCallNumber();
      }
    }, () => this.utilitiesService.dismissLoading());
  }

  getActionCallNumber() {
    this.apiService.get('API_status/onactioncall').subscribe((response: any) => {
      this.mobileNumber = response;
      this.utilitiesService.dismissLoading();
    }, () => this.utilitiesService.dismissLoading());
  }

  callNumber() {
    window.open('tel:' + this.mobileNumber, '_system');
  }

  openNearestFindPage(noti) {
    if (noti && noti.record) {
      const data = JSON.parse(noti.record);
      this.router.navigate([`/nearest-sizes/${data.heigth}/${data.width}/${data.gsm}`]);
    }
  }

  doRefresh(event) {
    this.getNotifications(event);
  }
}
