import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LocDetailsPageRoutingModule } from './loc-details-routing.module';

import { LocDetailsPage } from './loc-details.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LocDetailsPageRoutingModule
  ],
  declarations: [LocDetailsPage]
})
export class LocDetailsPageModule {}
