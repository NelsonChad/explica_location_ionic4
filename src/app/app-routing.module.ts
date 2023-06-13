import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadChildren: () => import('./tabs/tabs.module').then(m => m.TabsPageModule)
  },
  {
    path: 'loc-details/:id',
    loadChildren: () => import('./loc-details/loc-details.module').then(m => m.LocDetailsPageModule)
  },
  {
    path: 'register-user',
    loadChildren: () => import('./register-user/register-user.module').then(m => m.RegisterUserPageModule)
  },
  {
    path: 'login',
    loadChildren: () => import('./login/login.module').then(m => m.LoginPageModule)
  },
  {
    path: 'student',
    loadChildren: () => import('./student/student.module').then(m => m.StudentPageModule)
  },
  {
    path: 'explainer',
    loadChildren: () => import('./explainer/explainer.module').then(m => m.ExplainerPageModule)
  },
  {
    path: 'finalize/:id',
    loadChildren: () => import('./finalize/finalize.module').then(m => m.FinalizePageModule)
  },
  {
    path: 'locations-modal',
    loadChildren: () => import('./locations-modal/locations-modal.module').then( m => m.LocationsModalPageModule)
  }
];
@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
