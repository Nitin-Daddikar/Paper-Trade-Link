import { Injectable } from '@angular/core';
import { Network } from '@ionic-native/network/ngx';
import { NativeStorage } from '@ionic-native/native-storage/ngx';
import { ToastController, AlertController, LoadingController } from '@ionic/angular';

@Injectable({
  providedIn: 'root',
})
export class UtilitiesService {

  sessionTimeOut = 'SessionTimeOut';
  private loader: HTMLIonLoadingElement;
  private loaderLoading = false;
  generalErrorObj = {
    header : 'Opps !',
    subHeader : 'Something went wrong. Contact your administrator.'
  };
  labels = null;

  constructor(private network: Network, private toastCtrl: ToastController, private alertCtrl: AlertController,
              private storage: NativeStorage, private loadingCtrl: LoadingController) { }

  setLabels(labels) {
    this.labels = labels;
  }

  getLabels() {
    return this.labels;
  }

  async sessionTimeOutPopup() {
    const alert = await this.alertCtrl.create({
      backdropDismiss : false,
      header: 'Session Timeout',
      subHeader: 'Please log in again to continue',
      buttons: [
        {
          text: 'Ok',
          handler: () => {
            //this.events.publish('hitLogout');
          }
        }
      ]
    });
    await alert.present();
  }

  isInternatConnectionAvailable() {
    let isInternetPresent = false;
    if (this.network !== undefined && this.network != null && this.network.type !== undefined && this.network.type !== null) {
      isInternetPresent = this.network.type.toLowerCase() !== 'none';
    } else {
      isInternetPresent = false;
    }

    if (!isInternetPresent) {
      this.showNoInternetToast();
    }

    return isInternetPresent;
  }

  async showNoInternetToast() {
    const toast = await this.toastCtrl.create({
      message: 'Check your internet connection.',
      duration: 3000,
      position: 'bottom'
    });

    return await toast.present();
  }

  public showLoading(message = 'Please wait...') {
    this.loaderLoading = true;
    this.loadingCtrl.create({
        message
    }).then(load => {
        this.loader = load;
        load.present().then(() => { this.loaderLoading = false; });
    });
  }

  public dismissLoading() {
    const interval = setInterval(() => {
      if (this.loader || !this.loaderLoading) {
          this.loader.dismiss().then(() => { this.loader = null; clearInterval(interval)});
      } else if (!this.loader && !this.loaderLoading) {
          clearInterval(interval);
      }
    }, 500);
  }

  clearUserData() {
    this.storage.remove('user-isLoggedIn');
    this.storage.remove('user-token');
    this.storage.remove('user-data');
    this.storage.remove('clientFilters');
    this.storage.remove('taskFilters');
  }

  async presentErrorAlert(header?, subHeader?) {
    const alert = await this.alertCtrl.create({
      header : header ? header : this.generalErrorObj.header,
      subHeader : subHeader ? subHeader : this.generalErrorObj.subHeader,
      buttons: [{
        text: 'Ok',
        role: 'cancel',
        handler: () => {
          //this.events.publish('backButtonClick');
        }
      }]
    });

    await alert.present();
  }

  serialize = (obj) => {
    const str = [];
    for (const p in obj) {
      if (obj.hasOwnProperty(p)) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]));
      }
    }
    return str.join('&');
  }

  isCordovaAvailable = () => {
    if (!(<any>window).cordova) {
      return false;
    }
    return true;
  }

}
