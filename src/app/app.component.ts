import { Component, QueryList, ViewChildren } from '@angular/core';

import { Platform, NavController, ModalController, MenuController,
          ActionSheetController, PopoverController, IonRouterOutlet } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { APIService } from './services/api.services';
import { UtilitiesService } from './services/utilities.services';
import { AuthService } from './services/auth.service';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { Router, NavigationStart } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  // set up hardware back button event.
  lastTimeBackPress = 0;
  timePeriodToExit = 2000;
  firstTime = false;

  @ViewChildren(IonRouterOutlet) routerOutlets: QueryList<IonRouterOutlet>;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
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
  ) {
    this.initializeApp();

    this.router.events.pipe(filter(event => event instanceof NavigationStart))
    .subscribe((event: NavigationStart) => {
      this.firstTime = true;
    });
    this.backButtonEvent();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.getLabels();
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
    this.apiService.get('API_labels/labels').subscribe((labels: any) => {
      if (labels) {
        this.utilitiesService.setLabels(labels);
      }
    }, () => {},
    () => {

      if (this.utilitiesService.isCordovaAvailable()) {
        this.storage.getItem('mobileNumber').then(
          mobileNumber => {
            if (mobileNumber) {
              this.authService.setMobileNumber = mobileNumber;
              this.storage.getItem('stockAccess').then(
                stockAccess => {
                  this.authService.setstockAccess = stockAccess;
                  this.storage.getItem('isLoggedIn').then(
                    isLoggedIn => {
                      this.authService.UserLoggedIn = isLoggedIn;
                      this.statusBar.styleDefault();
                      this.splashScreen.hide();
                    }
                  );
                }
              );
            }
          }
        );
      } else {
        // Nitin temp
        // this.authService.setMobileNumber = '9699814688';
        // this.authService.setstockAccess = 0;
        // this.authService.UserLoggedIn = true;
        // this.statusBar.styleDefault();
        // this.splashScreen.hide();
      }

    });
  }

  get isUserLoggedIn() {
    return this.authService.isUserLoggedIn;
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
