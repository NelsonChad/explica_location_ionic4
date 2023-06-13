import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LocDetailsPage } from './loc-details.page';

const routes: Routes = [
  {
    path: '',
    component: LocDetailsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LocDetailsPageRoutingModule {}
