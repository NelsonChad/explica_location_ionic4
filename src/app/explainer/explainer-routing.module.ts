import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExplainerPage } from './explainer.page';

const routes: Routes = [
  {
    path: '',
    component: ExplainerPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplainerPageRoutingModule {}
