import { Component } from '@angular/core';
import { APIService } from '../services/api.services';
import { UtilitiesService } from '../services/utilities.services';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';

@Component({
  selector: 'app-contact-us',
  templateUrl: './contact-us.component.html',
  styleUrls: ['./contact-us.component.scss'],
})
export class ContactUsComponent {

  location = null;
  constructor(private apiService: APIService, private utilitiesService: UtilitiesService, private iab: InAppBrowser) {
    this.getOptions();
  }

  getOptions() {
    this.location = null;
    this.utilitiesService.showLoading()
    this.apiService.get('API_status/option_masters').subscribe((res: any) => {
      const options = res.data;
      if (options) {
        options.forEach(option => {
          if (option.option == 'location') {
            this.location = option.value;
          }
        });
      }
      this.utilitiesService.dismissLoading();
    }, () => this.utilitiesService.dismissLoading());
  }

  openLocation() {
    this.iab.create(this.location, '_system', 'location=yes');
  }
}
