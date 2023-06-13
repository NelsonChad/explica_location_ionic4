import { PlacesService } from './../services/places.service';
import { Component, OnInit } from '@angular/core';
import { NavController, ToastController } from '@ionic/angular';
import { RegisterUserService } from '../services/register-user.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-finalize',
  templateUrl: './finalize.page.html',
  styleUrls: ['./finalize.page.scss'],
})
export class FinalizePage implements OnInit {

  public contacts = false;
  public subjects = true;
  public contact = '';
  public subject = '';
  public id: any;

  public contactsList: any;
  public subjectsList: any;

  public contactBody: any = {
    contact: '',
    explainer_id: '',
  };

  public subjectBody: any = {
    name: '',
    explainer_id: '',
    price: '0.0',
    decription: 'nova disciplina',
    grade: 'all'
  };


  constructor(
    public navCtrl: NavController,
    private registerUserService: RegisterUserService,
    public toastController: ToastController,
    private activatedRoute: ActivatedRoute,
    private placesService: PlacesService
  ) {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
  }

  ngOnInit() {
    this.getContacts();
    this.getSubjects();
  }

  finalise() {
    this.navCtrl.navigateRoot('/');
  }

  async saveContact(contact) {
    this.contactBody.contact = contact;
    this.contactBody.explainer_id = this.id;

    await this.registerUserService.addContact(this.contactBody).subscribe(res => {
      if (res.status === true) {
        this.presentToast('Contact adicionado!');
        this.contact = '';
        this.getContacts();


      } else {
        console.log(res.message);
      }
    }, err => {
      console.log(err);
    });
  }
  async saveSubject(subj) {
    this.subjectBody.name = subj;
    this.subjectBody.explainer_id = this.id;

    await this.registerUserService.addSubject(this.subjectBody).subscribe(res => {
      if (res.status === true) {
        this.presentToast('Disciplina adicionada!');
        this.subject = '';
        this.getSubjects();
      } else {
        console.log(res.message);
      }
    }, err => {
      console.log(err);
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

  async getContacts() {
    await this.placesService.getContacts(this.id)
      .subscribe(res => {
        console.log('CONTACTS: ' + res.data);
        this.contactsList = res.data;

        if (res.data != null) {
          this.contacts = true;
        }
      });
  }

  async getSubjects() {
    await this.placesService.getSubjects(this.id)
      .subscribe(res => {
        console.log('Subjects: ' + res.data);
        this.subjectsList = res.data;

        if (res.data != null) {
          this.contacts = true;
        }
      });
  }
}
