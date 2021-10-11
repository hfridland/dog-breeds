import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './main-layout/main-layout.component';
import { BreedLayoutComponent } from './main-layout/breed-layout/breed-layout.component';
import { LoginComponent } from './main-layout/login/login.component';

const routes: Routes = [
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', redirectTo: '/', pathMatch: 'full' },
      { path: '', component: BreedLayoutComponent },
      { path: 'login', component: LoginComponent },
      {
        path: 'about',
        loadChildren: () =>
          import('./additional/additional.module').then(
            (m) => m.AdditionalModule
          ),
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
