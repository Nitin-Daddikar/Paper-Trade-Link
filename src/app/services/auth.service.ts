import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    private isLoggedIn = false;
    private mobileNumber: any = '';
    private stockAccess: any = 0;

    constructor(private storage: NativeStorage) { }

    set UserLoggedIn(loggedIn) {
        this.isLoggedIn = loggedIn;
        if (loggedIn) {
            this.storage.setItem('isLoggedIn', this.isLoggedIn);
            this.storage.setItem('mobileNumber', this.mobileNumber);
            this.storage.setItem('stockAccess', this.stockAccess);
        }
    }

    get isUserLoggedIn() {
        return this.isLoggedIn;
    }

    set setMobileNumber(mobNumber) {
        this.mobileNumber = mobNumber;
    }

    get getMobileNumber() {
        return this.mobileNumber;
    }

    set setstockAccess(stockAccess) {
        this.stockAccess = stockAccess;
    }

    get getstockAccess() {
        return this.stockAccess;
    }

    logOutUser() {
      this.UserLoggedIn = false;
      this.mobileNumber = '';
      this.stockAccess = 0;
      this.storage.remove('isLoggedIn');
      this.storage.remove('mobileNumber');
      this.storage.remove('stockAccess');
    }

}
