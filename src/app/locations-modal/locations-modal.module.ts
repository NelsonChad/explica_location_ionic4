import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocationsModalPageRoutingModule } from './locations-modal-routing.module';

import { LocationsModalPage } from './locations-modal.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocationsModalPageRoutingModule
  ],
  declarations: [LocationsModalPage]
})
export class LocationsModalPageModule {}
