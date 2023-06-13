import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RegisterUserPage } from './register-user.page';

const routes: Routes = [
  {
    path: '',
    component: RegisterUserPage,
    children: [
      {
        path: 'student',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../student/student.module').then(m => m.StudentPageModule)
          }
        ]
      },
      {
        path: 'explainer',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../explainer/explainer.module').then(m => m.ExplainerPageModule)
          }
        ]
      }
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RegisterUserPageRoutingModule { }
