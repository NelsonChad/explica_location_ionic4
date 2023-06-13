import { Component } from '@angular/core';
import { MenuController } from '@ionic/angular';
import { PlacesService } from '../services/places.service';
import { Storage } from '@ionic/storage';


@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  public explainerId: any;
  public avatar: any = 'default.png';
  public enrollments: any;

  constructor(
    private menu: MenuController,
    public placesService: PlacesService,
    public storage: Storage

  ) {
    this.getEnrollments();
  }

  accept(id) {

  }

  decline(id) {

  }

  async getExplID() {
    await this.storage.get('STUDENT').then(
      async (val) => {
        console.log('IDDD:: ', val.id);

        this.explainerId = val.id;
      });
  }

  async getEnrollments() {
    await this.getExplID();
    await this.placesService.getEnroll(this.explainerId)
      .subscribe(res => {
        console.log(res.data);
        this.enrollments = res.data;
        console.log('ENROLL:: ', JSON.stringify(this.enrollments));
      }, err => {
        console.log(err);
      });
  }

  openCustom() {
    this.menu.enable(true, 'custom');
    this.menu.open('custom');
  }
}
