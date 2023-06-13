import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegisterUserService } from '../services/register-user.service';
import { LoadingController, NavController, ToastController } from '@ionic/angular';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { GpsDataService } from '../services/gps-data.service';

declare var google: any;

@Component({
  selector: 'app-student',
  templateUrl: './student.page.html',
  styleUrls: ['./student.page.scss'],
})
export class StudentPage implements OnInit {

  public lat: any;
  public lng: any;
  public located = false;
  public address: any;

  public student: any = {
    name: '',
    surname: '',
    email: '',
    password: '',
    avatar: 'default.png',
    number: '',
    lat: null,
    lng: null,
    type: 1,
    level_id: 1,
  };

  public studentForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder, // forms
    public gpsData: GpsDataService,
    private geolocation: Geolocation,
    private registerUserService: RegisterUserService,
    private loadingCtrl: LoadingController,
    public navCtrl: NavController,
    public toastController: ToastController,

  ) { }

  ngOnInit() {
    this.initForm();
    this.getLocation();
  }

  initForm() {
    this.studentForm = this.formBuilder.group({
      name: [null, [Validators.required, Validators.minLength(5)]],
      surname: [null, [Validators.required, Validators.minLength(5)]],
      email: [null, [Validators.required, Validators.pattern('.+\@.+\..+')]],
      // avatar: [null, [Validators.required, Validators.minLength(5)]], 
      number: [null, [Validators.required, Validators.pattern('^[0-9]*$'), Validators.minLength(8), Validators.maxLength(9)]],
      // number: [null, [Validators.required, Validators.minLength(8)]],
      lat: [null],
      lng: [null],

      password: [null, [Validators.required, Validators.minLength(6)]],
    });
  }

  async studentAdd(form) {
    this.student.lat = this.lat;
    this.student.lng = this.lng;

    console.warn('ENTROU NO ADD');

    if (this.lat == null) {
      await this.getLocation();
    }

    this.student.name = form.name;
    this.student.email = form.email;
    this.student.password = form.password;
    this.student.surname = form.surname;
    this.student.number = form.number;

    console.log('DADOS: ' + JSON.stringify(this.student));

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

      console.log('FORM: ' + JSON.stringify(this.student));
      await this.registerUserService.addStudent(this.student).subscribe(res => {
        if (res.status === true) {
          this.presentToast('Estudante cadastrado!');
          this.studentForm.reset();
          console.log('Messagem: ' + res.message + 'Status: ' + res.status);
          loading.dismiss();

          console.log('IDDDDDD: ' + res.student.id);


          this.navCtrl.navigateRoot('/');
          // this.navCtrl.navigateRoot('/finalize/' + res.explainer.id);

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
    console.log('Localizando...');
    await this.geolocation.getCurrentPosition({ enableHighAccuracy: true }).then((position) => {
      console.log('Current: LNG: ', position.coords.longitude, ' LAT: ', position.coords.latitude);

      this.lat = position.coords.latitude;
      this.lng = position.coords.longitude;

      this.located = true;
      console.log('Localizado!');

      let latlng: any;
      latlng = new google.maps.LatLng(this.lat, this.lng); // get Coords

      this.address = this.gpsData.getCoordsCityName(latlng);
      console.log('RETORNO: ' + this.gpsData.getCoordsCityName(latlng));


    }, err => {
      alert('Can not retrieve Location' + err.message);
    }).catch((error) => {
      console.log('Error getting location', error.message);
    });

    console.warn('FORALL: ', this.address);

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
