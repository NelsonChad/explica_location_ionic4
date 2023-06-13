import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FinalizePage } from './finalize.page';

const routes: Routes = [
  {
    path: '',
    component: FinalizePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FinalizePageRoutingModule {}
