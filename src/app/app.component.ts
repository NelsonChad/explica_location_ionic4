import { Component } from '@angular/core';

import { Platform, MenuController, AlertController, NavController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from '@ionic/storage';
import { AuthService } from './services/auth.service';


@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  public connected = true;
  public logued = false;
  public username: any;
  public avatar: any;
  public type = 0;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private menuController: MenuController,
    private alertController: AlertController,
    private storage: Storage,
    private auth: AuthService,
    private navCtrl: NavController,

  ) {
    this.initializeApp();

    this.setUser();

    this.auth.isLoggedIn().subscribe(res => {
      console.log('IS LOGUED?:' + res);
      if (res) {
        this.storage.get('STUDENT').then(
          async (val) => {
            if (val) {
              this.type = val.type;
              this.username = val.name;
              this.avatar = val.avatar;
              this.logued = true;
            }
          }
        );
      }
    });
  }
  public closeMenu() {
    // this.navCtrl.navigateForward('/cart'); // abre a pagina cart
    this.menuController.toggle(); // feixa o menu
  }

  setUser() {
    this.storage.get('STUDENT').then(
      async (val) => {
        if (val) {
          console.log("EST GUARD: " + JSON.stringify(val));
          this.username = val.name;
          this.avatar = val.avatar;
          this.auth.authSubject.next(true);
          this.logued = true;
          this.type = val.type;

          if (val.type == 2) {
            this.auth.isExplainer.next(true);
          }

        }
      }
    );
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      header: 'Confirm!',
      message: '<strong>Pretende realmente sair?</strong>',
      buttons: [
        {
          text: 'Não',
          role: 'cancel',
          cssClass: 'secondary',
          handler: (blah) => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Sim',
          handler: () => {
            console.log('Confirm Okay');
            this.logout();
          }
        }
      ]
    });

    await alert.present();
  }

  logout() {
    this.auth.logoutStudent();
    this.navCtrl.navigateRoot('/');
    this.logued = false;
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
