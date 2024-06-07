import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilitiesService } from './utilities.services';

@Injectable({
  providedIn: 'root',
})
export class APIService {

  apiUrl = 'http://papertradelink.com/apis/';
  // apiUrl = 'http://test.papertradelink.com/apis/';

  constructor(private httpClient: HttpClient) {
  }

  get(url) {
    return this.httpClient.get(this.apiUrl + url);
  }

  post(url, param) {
    return this.httpClient.post(this.apiUrl + url, param);
  }

}
