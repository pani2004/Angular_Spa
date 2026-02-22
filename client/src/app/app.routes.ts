import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { UserRole } from './models/user.model';
import { Login } from './components/login/login';
import { RegisterComponent } from './components/register/register';
import { Dashboard } from './components/dashboard/dashboard';
import { Admin } from './components/admin/admin';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'register', component: RegisterComponent },
  { 
    path: 'dashboard', 
    component: Dashboard, 
    canActivate: [authGuard] 
  },
  { 
    path: 'admin', 
    component: Admin, 
    canActivate: [authGuard],
    data: { role: UserRole.ADMIN }
  },
  { path: '**', redirectTo: '/login' }
];
