import { Component, ChangeDetectorRef } from '@angular/core';
import { Location } from '@angular/common';
import { APIService } from '../services/api.services';
import { UtilitiesService } from '../services/utilities.services';
import { NavController } from '@ionic/angular';
import { AuthService } from '../services/auth.service';
import { Sim } from '@ionic-native/sim/ngx';
declare var SMSReceive: any;

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  mobileNumber: number;
  password: string;
  OTP: number;
  newPassword: string;
  reNewPassword: string;

  phase = 'verify_no'; // verify_no, login, OTP, forgotPassword, setPassword
  constructor(private apiService: APIService, private utilitiesService: UtilitiesService, private location: Location,
              private navCtrl: NavController, private authService: AuthService, private sim: Sim, private cdr: ChangeDetectorRef) { }

  verifyMobileNumber() {
    if (this.mobileNumber && this.utilitiesService.isInternatConnectionAvailable()) {
      this.utilitiesService.showLoading();
      this.apiService.get('API_login/get_details/' + this.mobileNumber).subscribe((response: any) => {
        if (response.count >= 1 && response.otp != 'Y' && response.active == 0) {

          this.apiService.get('API_login/verify_no/' + this.mobileNumber).subscribe((verifyResponse: any) => {
            if (verifyResponse.count >= 1 && verifyResponse.otp != 'Y') {
              this.startListingSMS();
              this.phase = 'OTP';
              this.utilitiesService.dismissLoading();
            }
          });

        } else if (response.count >= 1 && response.otp == 'Y' && response.active == 1) {
          this.phase = 'login';
          this.utilitiesService.dismissLoading();
        } else if (response.password != '' && response.otp == 'Y' && response.active == 1) {
          this.phase = 'forgotPassword';
          this.utilitiesService.dismissLoading();
        } else if (response.count == '0') {
          this.utilitiesService.dismissLoading();
          this.utilitiesService.presentErrorAlert('Error', 'Your Mobile Number Is Not Register');
        } else if (response.active == 0) {
          this.utilitiesService.dismissLoading();
          this.utilitiesService.presentErrorAlert('Error', 'Your account has been deactivated. Please contact your administrator');
        }
      }, () => {
        this.utilitiesService.dismissLoading();
        this.utilitiesService.presentErrorAlert();
      });
    }
  }

  verfiyOTP(showError = true) {
    if (this.utilitiesService.isInternatConnectionAvailable() && this.OTP) {
      this.utilitiesService.showLoading();
      this.apiService.get('API_login/verify_otp/' + this.OTP + '/' + this.mobileNumber).subscribe((verifyResponse: any) => {
        this.utilitiesService.dismissLoading();
        if (verifyResponse >= 1) {
          this.stopListingSMS();
          this.phase = 'setPassword';
          this.cdr.detectChanges();
          this.OTP = null;
        } else if (showError) {
          this.utilitiesService.presentErrorAlert('Error', 'Please Enter Vaild OTP Or Click on Re-send OTP');
        }
      }, () => {
        this.utilitiesService.dismissLoading();
        this.utilitiesService.presentErrorAlert();
      });
    }
  }

  resendOTP() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.apiService.get('API_login/SendSMS/' + this.mobileNumber).subscribe((verifyResponse: any) => {});
    }
  }

  doLogin() {
    if (this.mobileNumber && this.password && this.password.length >= 0 && this.utilitiesService.isInternatConnectionAvailable()) {
      this.checkSIMPermission();
    }
  }

  forgotPassword() {
    this.phase = 'forgotPassword';
  }

  forgot_password_fbn() {
    if (this.utilitiesService.isInternatConnectionAvailable()) {
      this.utilitiesService.showLoading();
      this.apiService.get('API_login/verify_no_new/' + this.mobileNumber).subscribe((verifyResponse: any) => {
        if (verifyResponse.password != ' ') {
          this.startListingSMS();
          this.phase = 'OTP';
        }
        this.utilitiesService.dismissLoading();
      }, () => {
        this.utilitiesService.dismissLoading();
        this.utilitiesService.presentErrorAlert();
      });
    }
  }

  set_password() {
    if (this.newPassword === this.reNewPassword) {
      if (this.utilitiesService.isInternatConnectionAvailable()) {
        this.apiService.get('API_login/set_password/' + this.newPassword + '/' + this.mobileNumber)
        .subscribe((res: any) => { });
        this.phase = 'login';
        this.newPassword = '';
        this.reNewPassword = '';
      }
    } else {
      this.utilitiesService.presentErrorAlert('Error', 'Entered Password and Re-type Password Does Not Match');
    }
  }

  checkSIMPermission() {
    if (this.utilitiesService.isCordovaAvailable()) {
      this.sim.hasReadPermission().then(
        (info) => {
          if (info) {
            this.getSimInfo();
          } else {
            this.askSIMPermission();
          }
        },
        () => this.proceedLogin()
      );
    } else {
      this.proceedLogin();
    }
  }

  askSIMPermission() {
    this.sim.requestReadPermission().then(
      () => this.getSimInfo(),
      () => this.proceedLogin()
    );
  }

  getSimInfo() {
    this.sim.getSimInfo().then(
      (simInfo) => {
        this.proceedLogin(simInfo);
      },
      () => this.proceedLogin()
    );
  }

  proceedLogin(mobileInfo: any = 'Rights not given') {
    this.utilitiesService.showLoading();

    const formData = new FormData();
    formData.append('mobile', this.mobileNumber + '');
    formData.append('password', this.password);
    formData.append('mobile_info', JSON.stringify(mobileInfo));

    this.apiService.post('API_login/login_new', formData).subscribe((response: any) => {
      if (response) {
        let count = 0;
        let stockAccess = 1;
        response.forEach(res => {
          if (res.company_name != '') {
            stockAccess = res.stock_active;
            count++;
          }
        });

        this.utilitiesService.dismissLoading();
        if (count >= 1) {
          this.authService.setMobileNumber = this.mobileNumber;
          this.authService.setstockAccess = stockAccess;
          this.authService.UserLoggedIn = true;
          this.navCtrl.navigateRoot('/nearest-sizes');
        } else {
          this.utilitiesService.presentErrorAlert('Error', 'Please Enter Correct Credentials');
        }
      }
    }, () => {
      this.utilitiesService.dismissLoading();
      this.utilitiesService.presentErrorAlert();
    });
  }

  startListingSMS() {
    if (this.utilitiesService.isCordovaAvailable()) {
      SMSReceive.startWatch(
        () => {
          console.log('watch started');
          this.resendOTP();
          document.addEventListener('onSMSArrive', (e: any) => {
            console.log('onSMSArrive()');
            if (e && e.data && e.data.body) {
              const IncomingSMS = e.data.body.trim();
              this.OTP = IncomingSMS.split(' ')[0];
              this.verfiyOTP(false);
            }
          });
        },
        () => {
          console.log('watch start failed');
          this.resendOTP();
        }
      );
    }
  }

  stopListingSMS() {
    if (this.utilitiesService.isCordovaAvailable()) {
      SMSReceive.stopWatch(
        () => console.log('watch stopped'),
        () => console.log('watch stop failed')
      );
    }
  }

  goBack() {
    this.location.back();
  }
}
