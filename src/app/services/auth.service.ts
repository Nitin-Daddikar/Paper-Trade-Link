import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

    private isLoggedIn = false;
    private mobileNumber: any = '';

    constructor(private storage: NativeStorage) { }

    set UserLoggedIn(loggedIn) {
        this.isLoggedIn = loggedIn;
        if (loggedIn) {
            this.storage.setItem('isLoggedIn', this.isLoggedIn);
            this.storage.setItem('mobileNumber', this.mobileNumber);
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

    logOutUser() {
      this.UserLoggedIn = false;
      this.mobileNumber = '';
      this.storage.remove('isLoggedIn');
      this.storage.remove('mobileNumber');
    }

}
