import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PlacesService } from '../services/places.service';
import { LoadingController, NavController } from '@ionic/angular';
import { RegisterUserService } from '../services/register-user.service';
import { FunctionsService } from '../services/functions.service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-loc-details',
  templateUrl: './loc-details.page.html',
  styleUrls: ['./loc-details.page.scss'],
})
export class LocDetailsPage implements OnInit {
  private id: any;
  private studentId: any;
  public place: any;

  public contacts: any;
  public subjects: any;

  private body: any = {
    student_id: '',
    explainer_id: ''
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    public placesService: PlacesService,
    public loadingController: LoadingController,
    public registerUserService: RegisterUserService,
    private navCtrl: NavController,
    private func: FunctionsService,
    public storage: Storage) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

  }

  ngOnInit() {
    this.getStudentID();
    this.getProduct();
    this.getContacts();
    this.getSubjects();
  }

  getStudentID() {
    this.storage.get('STUDENT').then(
      async (val) => {
        this.studentId = val.id;
      });
  }

  async getProduct() {
    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'loading-loader-class'
    });
    await loading.present();
    await this.placesService.getPlace(this.id)
      .subscribe(res => {
        console.log(res.data);
        this.place = res.data;
        console.log('Lugar: ', this.place.name);
        loading.dismiss();
      }, err => {
        console.log(err);
        loading.dismiss();
      });
  }

  async getContacts() {
    await this.placesService.getContacts(this.id)
      .subscribe(res => {
        console.log(res.data);
        this.contacts = res.data;
        console.log('CONTACTS:: ', JSON.stringify(this.contacts));
      }, err => {
        console.log(err);
      });
  }

  async getSubjects() {
    await this.placesService.getSubjects(this.id)
      .subscribe(res => {
        console.log('Subjects: ' + res.data);
        this.subjects = res.data;

        if (res.data != null) {
          this.contacts = true;
        }
      });
  }

  async request() {
    this.body.student_id = this.studentId;
    this.body.explainer_id = this.id;

    console.log('BODY: ' + JSON.stringify(this.body));

    const loading = await this.loadingController.create({
      spinner: null,
      cssClass: 'loading-loader-class'
    });
    await loading.present();
    await this.registerUserService.addRequest(this.body).subscribe(
      res => {
        console.log('RESPONSE_STATUS: ' + res.status);

        this.func.presentToast('Pedido Enviado');
        loading.dismiss();
        this.navCtrl.navigateRoot('/');

      }, err => {
        console.log(err);
        loading.dismiss();
        // this.func.presentAlert('Um erro ocorreu', null, 'Tente novamente!');
        this.func.presentAlert('Falha ao Enviar', null, err.message);
      }
    );
  }

}
