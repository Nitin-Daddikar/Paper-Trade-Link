import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UtilitiesService } from './utilities.services';

@Injectable({
  providedIn: 'root',
})
export class APIService {

  // apiUrl = 'http://127.0.0.1:8000/apis/';
  apiUrl = 'http://papertradelink.com/apis/';

  constructor(private httpClient: HttpClient) {
  }

  get(url) {
    return this.httpClient.get(this.apiUrl + url);
  }

  post(url, param) {
    return this.httpClient.post(this.apiUrl + url, param);
  }

}
