import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-locations-modal',
  templateUrl: './locations-modal.page.html',
  styleUrls: ['./locations-modal.page.scss'],
})
export class LocationsModalPage implements OnInit {

  public toParentPage: any;
  locations: any;

  constructor(private modalCtrl: ModalController,private navParams: NavParams) { 
    this.locations = this.navParams.data.locations;
  }

  ngOnInit() {
    console.log('LOCAIS: ',this.locations)
  }

  dismiss() {
    this.modalCtrl.dismiss({ data: this.toParentPage });
  } 

  SelectSearchResult(item){
    this.toParentPage = item;
    this.dismiss()
    console.log('ITEM S: ',item)
  }

  searchItems(ev: any) {
    const val = ev.target.value;
    if (val && val.trim() !== "") {
      this.locations = this.locations.filter((item) => {
        let stat = item.name.toLowerCase().indexOf(val.toLowerCase()) > -1;
        return stat;
      });
    } else {
    }
  }

}
