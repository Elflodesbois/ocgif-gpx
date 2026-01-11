import { Routes } from '@angular/router';

import { Login } from './pages/login/login';
import { Register } from './pages/register/register';
import { Dashboard } from './pages/dashboard/dashboard';
import { authGuard } from './guards/auth-guard';
import { MesTraces } from './pages/mes-traces/mes-traces';
import { AjoutGpx } from './pages/ajout-gpx/ajout-gpx';

export const routes: Routes = [
  { path: 'login', component: Login },
  { path: 'register', component: Register },

  {
    path: 'dashboard',
    component: Dashboard,
    canActivate: [authGuard] // protégé
  },
  { path: 'mes-traces', component: MesTraces, canActivate: [authGuard] // protégé
   },
   {
    path: 'ajout-gpx',
    component: AjoutGpx,
    canActivate: [authGuard] // protégé
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' }
];