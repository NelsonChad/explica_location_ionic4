import { Injectable } from '@angular/core';
import { ToastController, AlertController } from '@ionic/angular';
import { Storage } from '@ionic/storage';

@Injectable({
  providedIn: 'root'
})
export class FunctionsService {

  constructor(
    private toastController: ToastController,
    private storage: Storage,
    private alertController: AlertController,
  ) { }

  /*USER_ID = this.storage.get('ACCESS_TOKEN').then(
      (val) => {
        console.log('ACCESS_TOKEN: ', val);
        return val;
      });*/

  async presentToast(showMessage) {
    const toast = await this.toastController.create({
      message: showMessage,
      duration: 4000,
      position: 'top',
      cssClass: 'normalToast'
    });
    toast.present();
  }

  async presentAlert(title, subtitle, text) {
    const alert = await this.alertController.create({
      header: title,
      subHeader: subtitle,
      message: text,
      buttons: ['OK']
    });

    await alert.present();
  }
}
