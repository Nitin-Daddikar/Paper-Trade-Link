import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { APIService } from '../services/api.services';
import { UtilitiesService } from '../services/utilities.services';

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
  constructor(private apiService: APIService, private utilitiesService: UtilitiesService, private location: Location) { }

  verifyMobileNumber() {
    if (this.mobileNumber) {
      this.apiService.get('API_login/get_details/' + this.mobileNumber).subscribe((response: any) => {
        if (response.count >= 1 && response.otp != 'Y' && response.active == 0) {

          this.apiService.get('API_login/verify_no/' + this.mobileNumber).subscribe((verifyResponse: any) => {
            if (verifyResponse.count >= 1 && verifyResponse.otp != 'Y') {
              this.phase = 'OTP';
            }
          });

        } else if (response.count >= 1 && response.otp == 'Y' && response.active == 1) {
          this.phase = 'login';
        } else if (response.password != '' && response.otp == 'Y' && response.active == 1) {
          this.phase = 'forgotPassword';
        } else if (response.count == '0') {
          this.utilitiesService.presentErrorAlert('Error', 'Your Mobile Number Is Not Register');
        }
      });
    }
  }

  verfiyOTP() {
    this.apiService.get('API_login/verify_otp/' + this.OTP + '/' + this.mobileNumber).subscribe((verifyResponse: any) => {
      if (verifyResponse >= 1) {
        this.phase = 'setPassword';
      } else {
        this.utilitiesService.presentErrorAlert('Error', 'Please Enter Vaild OTP Or Click on Re-send OTP');
      }
    });
  }

  resendOTP() {
    this.apiService.get('API_login/SendSMS/' + this.mobileNumber);
  }

  doLogin() {
    if (this.mobileNumber && this.password && this.password.length >= 0) {
      this.apiService.get('API_login/login/' + this.mobileNumber + '/' + this.password).subscribe((response: any) => {
        if (response) {
          let count = 0;
          let stockAccess = 1;
          response.forEach(res => {
            if (res.company_name != '') {
              stockAccess = res.stock_active;
              count++;
            }
          });

          if (count >= 1) {
            alert('Login Success');
          } else {
            this.utilitiesService.presentErrorAlert('Error', 'Please Enter Correct Credentials');
          }
        }
      });
    }
  }

  forgotPassword() {
    this.phase = 'forgotPassword';
  }

  forgot_password_fbn() {
    this.apiService.get('API_login/verify_no/' + this.mobileNumber).subscribe((verifyResponse: any) => {
      if (verifyResponse.password != ' ') {
        this.phase = 'OTP';
      }
    });
  }

  set_password() {
    if (this.newPassword === this.reNewPassword) {
      this.apiService.get('API_login/set_password/' + this.newPassword + '/' + this.mobileNumber).subscribe((verifyResponse: any) => {
      });
      this.phase = 'login';
    } else {
      this.utilitiesService.presentErrorAlert('Error', 'Entered Password and Re-type Password Does Not Match');
    }
  }

  goBack() {
    this.location.back();
  }
}
