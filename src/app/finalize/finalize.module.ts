import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { FinalizePageRoutingModule } from './finalize-routing.module';

import { FinalizePage } from './finalize.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    FinalizePageRoutingModule
  ],
  declarations: [FinalizePage]
})
export class FinalizePageModule {}
