import { Component, QueryList, ViewChildren } from '@angular/core';

import { Platform, NavController, ModalController, MenuController,
          ActionSheetController, PopoverController, IonRouterOutlet } from '@ionic/angular';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { APIService } from './services/api.services';
import { UtilitiesService } from './services/utilities.services';
import { AuthService } from './services/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private statusBar: StatusBar,
    private apiService: APIService,
    private utilitiesService: UtilitiesService,
    private authService: AuthService,
    private navCtrl: NavController,
    private storage: NativeStorage,
    public modalCtrl: ModalController,
    private menu: MenuController,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController,
    private router: Router,
    private appVersion: AppVersion
  ) {
    this.initializeApp();

    this.router.events.pipe(filter(event => event instanceof NavigationStart))
    .subscribe((event: NavigationStart) => {
      this.firstTime = true;
    });
    this.backButtonEvent();
  }

  get isUserLoggedIn() {
    return this.authService.isUserLoggedIn;
  }

  // set up hardware back button event.
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  firstTime = false;
  currentVersionNo = null;
  totalOutstandingAmount = null;
  URLToOpen = '';

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  initializeApp() {
    this.platform.ready().then(() => {
      this.getLabels();
      this.oneSignalInIt();
      this.getAppVersion();
      this.utilitiesService.calculateOutstadingAmount.subscribe(res => {
        this.calculateOutstadingAmount();
      });
    });
  }

  // active hardware back button
  backButtonEvent() {
    this.platform.backButton.subscribe(async () => {
        try { // close action sheet
            const element = await this.actionSheetCtrl.getTop();
            if (element) {
                element.dismiss();
                return;
            }
        } catch (error) { console.log(error); }

        try { // close popover
            const element = await this.popoverCtrl.getTop();
            if (element) {
                element.dismiss();
                return;
            }
        } catch (error) { console.log(error); }

        try { // close modal
            const element = await this.modalCtrl.getTop();
            if (element) {
                element.dismiss();
                return;
            }
        } catch (error) { console.log(error); }

        try {// close side menu
            const element = await this.menu.getOpen();
            if (element) {
                this.menu.close();
                return;
            }
        } catch (error) { console.log(error); }

        this.routerOutlets.forEach((outlet: IonRouterOutlet) => {
            if (outlet && outlet.canGoBack()) {
              this.firstTime = true;
            } else if (!this.firstTime) {
                if (new Date().getTime() - this.lastTimeBackPress < this.timePeriodToExit) {
                    navigator['app'].exitApp(); // work in ionic 4
                } else {
                  this.utilitiesService.showToast(`Press back again to exit App.`);
                  this.lastTimeBackPress = new Date().getTime();
                }
            } else {
              this.firstTime = false;
            }
        });
    });
  }

  getLabels() {
    this.apiService.get('API_labels/labels').subscribe((response: any) => {
      if (response && response.data) {
        this.utilitiesService.setLabels(response.data);
      }
    }, () => {},
    () => {

      if (this.utilitiesService.isCordovaAvailable()) {
        this.storage.getItem('mobileNumber').then(
          mobileNumber => {
            if (mobileNumber) {
              this.authService.setMobileNumber = mobileNumber;

              this.storage.getItem('customerId').then(
                customerId => {
                  if (customerId) {
                    this.authService.setCustomerId = customerId;

                    this.storage.getItem('isLoggedIn').then(
                      isLoggedIn => {
                        this.authService.UserLoggedIn = isLoggedIn ? isLoggedIn : false;
                        this.hideSplashScreen();
                      },
                      () => this.hideSplashScreen()
                    );

                  } else {
                    this.hideSplashScreen();
                  }
                },
                () => this.hideSplashScreen()
              );

            } else {
              this.hideSplashScreen();
            }
          },
          () => this.hideSplashScreen()
        );
      } else {
        // Nitin temp
        // this.authService.setMobileNumber = '7387533080';
        // this.authService.setCustomerId = 2168;
        // this.authService.UserLoggedIn = true;
        // this.hideSplashScreen();
      }

    });
  }

  hideSplashScreen() {
    if (this.URLToOpen !== '') {
      this.navCtrl.navigateRoot(this.URLToOpen);
    }
    this.statusBar.styleDefault();
    (navigator as any).splashscreen.hide();
    this.calculateOutstadingAmount();
  }

  oneSignalInIt() {
    if (this.utilitiesService.isCordovaAvailable()) {
      try {
        // clarus.nitin - '7f98b411-2697-4e66-9b79-3711e2d33396', '266760528438'
        // mohit - 'd5689a9a-30c3-487b-bbae-684ea1c61d4d', '305260425877'
        
        // window['plugins'].OneSignal.startInit('d5689a9a-30c3-487b-bbae-684ea1c61d4d', '305260425877')
        //  .inFocusDisplaying(window['plugins'].OneSignal.OSInFocusDisplayOption.Notification)
        //  .handleNotificationOpened(this.onPushOpened)
        //  .endInit();

        (<any> window).plugins.OneSignal.setAppId('d5689a9a-30c3-487b-bbae-684ea1c61d4d');
        (<any> window).plugins.OneSignal.setNotificationOpenedHandler(this.onPushOpened);
      } catch (err) {
      }
    }
  }

  onPushOpened = function(receivedData) {
    if (receivedData.action && receivedData.action.actionID === 'order_now') {
      const data = receivedData.notification.payload.additionalData;
      this.URLToOpen = `/place-order/${data.height}/${data.width}/${data.gsm}`;
    } else {
      this.URLToOpen = '/broadcast-list';
    }
  }.bind(this);

  getAppVersion() {
    if (this.utilitiesService.isCordovaAvailable()) {
      this.appVersion.getVersionNumber().then(currentVersionNo => {
        this.currentVersionNo = currentVersionNo;
      });
    }
  }

  calculateOutstadingAmount() {
    this.totalOutstandingAmount = null;
    if (this.isUserLoggedIn) {
      const mobNumber = this.authService.getMobileNumber;
      this.apiService.get('API_outstand/company?mobile=' + mobNumber).subscribe((response: any) => {
        if (response && response.data && response.data.length > 0) {
          let totalAmount = 0;
          response.data.forEach(company => {
            if (company.summary && company.summary.length > 0) {
              const summary = company.summary;
              totalAmount += +summary[summary.length-1].Total_summ;
            }
          });
          if (totalAmount > 0) {
            this.totalOutstandingAmount = totalAmount;
          }
        }
      });
    }
  }

  openFeedback() {
    window.open('https://play.google.com/store/apps/details?id=com.ionicframework.test199784&hl=en', '_system', 'location=yes');
    return false;
  }

  logout() {
    this.authService.logOutUser();
    this.navCtrl.navigateRoot('/paper-weight-calc');
  }
}
