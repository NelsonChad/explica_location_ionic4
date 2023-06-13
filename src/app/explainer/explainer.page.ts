import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { RegisterUserService } from '../services/register-user.service';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Observable } from "rxjs"; // First you need to import Observable
import { GpsDataService } from '../services/gps-data.service';


declare var google: any;

@Component({
  selector: 'app-explainer',
  templateUrl: './explainer.page.html',
  styleUrls: ['./explainer.page.scss'],
})
export class ExplainerPage implements OnInit {

  public lat: any;
  public lng: any;
  public located = false;
  public address: any;

  public explainer: any = {
    name: '',
    avatar: 'default.png',
    min_price: '0.0',
    max_price: '0.0',
    email: '',
    slogan: '',
    description: '',
    password: '',
    open_time: null,
    close_time: null,
    grade_range: null,
    lat: null,
    lng: null,
    type: 2,
    province_id: null,
    exp_type_id: null,
  };
  public explainerForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder, // forms
    private geolocation: Geolocation,
    private registerUserService: RegisterUserService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastController: ToastController,
    public gpsData: GpsDataService,
  ) { }

  ngOnInit() {
    this.initForm();
    this.getLocation();
  }

  initForm() {
    this.explainerForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5)]],
      email: [null, [Validators.required, Validators.pattern('.+\@.+\..+')]],
      // avatar: [null, [Validators.required, Validators.minLength(5)]],
      // min_price: [null, [Validators.maxLength(11)]],
      // max_price: [null, [Validators.maxLength(11)]],
      slogan: [null, [Validators.required, Validators.minLength(6)]],
      lat: [null],
      lng: [null],
      open_time: [Validators.required],
      close_time: [Validators.required],
      desc: [null],

      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  async explainerAdd(form) {
    this.explainer.lat = this.lat;
    this.explainer.lng = this.lng;

    console.warn('ENTROU NO ADD');

    if (this.lat == null) {
      await this.getLocation();
    }

    // this.explainer.lat = this.gpsData.getLocation().accords.latitude;
    // this.explainer.lng = this.gpsData.getLocation().accords.longitude;


    this.explainer.name = form.name;
    this.explainer.email = form.email;
    this.explainer.password = form.password;
    this.explainer.slogan = form.slogan;
    this.explainer.description = form.desc;
    this.explainer.open_time = form.open_time;
    this.explainer.close_time = form.close_time;
    this.explainer.exp_type_id = 1;
    this.explainer.province_id = 1;

    console.log('DADOS: ' + JSON.stringify(this.explainer));

    await this.getLocation();

    if (this.located == false) {
      this.gpsData.presentAlertConfirm();
    } else {
      // REGEISTER
      const loading = await this.loadingCtrl.create({
        spinner: null,
        cssClass: 'loading-loader-class'
      });
      await loading.present();

      console.log('FORM: ' + JSON.stringify(this.explainer));

      await this.registerUserService.addExplainer(this.explainer).subscribe(res => {
        if (res.status === true) {
          this.presentToast('Explicador cadastrado!');
          this.explainerForm.reset();
          console.log('Messagem: ' + res.message + 'Status: ' + res.status);
          loading.dismiss();

          console.log('IDDDDDD: ' + res.explainer.id);


          // this.navCtrl.navigateRoot('/');
          // this.router.navigate(['/finalize', res.explainer.id]);
          this.navCtrl.navigateRoot('/finalize/' + res.explainer.id);

        } else {
          loading.dismiss();
          console.log(res.message);
        }
      }, err => {
        console.log(err);
        loading.dismiss();
      });
    }
  }

  async getLocation() {
    let ll: any;
    console.log('Localizando...');
    await this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then(async (position) => {
      console.log('Current: LNG: ', position.coords.longitude, ' LAT: ', position.coords.latitude);

      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;

      this.located = true;
      console.log('Localizado!');

      let latlng: any;
      latlng = new google.maps.LatLng(this.lat, this.lng); // get Coords
      this.gpsData.getCoordsCityName(latlng); // Method to get coords details as city

    }, err => {
      alert('Can not retrieve Location' + err.message);
    }).catch((error) => {
      console.log('Error getting location', error.message);
    });

    console.warn('FORA: ');
    this.gpsData.addressDetails.subscribe(res => {
      this.address = res;
      console.log('RESS Details OB2: ' + res);
    });

  }

  async presentToast(showMessage) {
    const toast = await this.toastController.create({
      message: showMessage,
      duration: 4000,
      position: 'top',
      cssClass: 'normalToast'
    });
    toast.present();
  }
}
