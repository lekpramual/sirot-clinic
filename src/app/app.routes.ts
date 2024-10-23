import { Routes } from '@angular/router';
import { AuthLayoutComponent } from './layouts/auth-layout/auth-layout.component';
import { LoginComponent } from './pages/login/login.component';
import { AdminLayoutComponent } from './layouts/admin-layout/admin-layout.component';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  /*********************
   *********************
   * ADMIN ROUTERS
   ********************/
   {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'patient',
      },

      {
        path: 'patient',
        loadComponent : (() => import("../app/pages/patient/patient.component")),
      },
      {
        path: 'users',
        loadComponent : (() => import("../app/pages/users/users.component")),
      },{
        path: 'reports',
        loadComponent : (() => import("../app/pages/reports/reports.component")),
      }
    ],
  },
    /*********************
   *********************
   * GUARD ROUTERS
   ********************/
   {
    path: "auth",
    component: AuthLayoutComponent,
    children: [
      { path: "login", component: LoginComponent },
    ],
  },
  { path: "**", redirectTo: "auth/login" },
];
