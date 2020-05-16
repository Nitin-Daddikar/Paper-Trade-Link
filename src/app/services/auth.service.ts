import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    private isLoggedIn = false;
    private mobileNumber: any = '';
    private customerId: any = '';


    constructor(private storage: NativeStorage) { }

    set UserLoggedIn(loggedIn) {
        this.isLoggedIn = loggedIn;
        if (loggedIn) {
            this.storage.setItem('isLoggedIn', this.isLoggedIn);
            this.storage.setItem('mobileNumber', this.mobileNumber);
            this.storage.setItem('customerId', this.customerId);
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

    set setCustomerId(customerId) {
        this.customerId = customerId;
    }

    get getCustomerId() {
        return this.customerId;
    }

    logOutUser() {
      this.UserLoggedIn = false;
      this.mobileNumber = '';
      this.storage.remove('isLoggedIn');
      this.storage.remove('mobileNumber');
      this.storage.remove('customerId');
    }

}
