import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocationsModalPage } from './locations-modal.page';

const routes: Routes = [
  {
    path: '',
    component: LocationsModalPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocationsModalPageRoutingModule {}
