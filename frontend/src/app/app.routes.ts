import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { AuthRedirect } from './core/guards/auth-redirect.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/dashboard', pathMatch: 'full' },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login').then(m => m.Login),
    canActivate: [AuthRedirect]
  },
  {
    path: 'register',
    loadComponent: () => import('./features/auth/register/register').then(m => m.Register),
    canActivate: [AuthRedirect]
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard').then(m => m.Dashboard),
    canActivate: [AuthGuard]
  },
  {
    path: 'user-list',
    loadComponent: () => import('./features/users/user-list/user-list').then(m => m.UserList),
    canActivate: [AuthGuard]
  },
  {
    path: 'user/create',
    loadComponent: () => import('./features/users/user-form/user-form').then(m => m.UserForm),
    canActivate: [AuthGuard]
  },
  {
    path: 'user/edit/:id',
    loadComponent: () => import('./features/users/user-form/user-form').then(m => m.UserForm),
    canActivate: [AuthGuard]
  },
  {
    path: 'product-list',
    loadComponent: () => import('./features/products/product-list/product-list').then(m => m.ProductList),
    canActivate: [AuthGuard]
  },
  {
    path: 'product/create',
    loadComponent: () => import('./features/products/product-form/product-form').then(m => m.ProductForm),
    canActivate: [AuthGuard]
  },
  {
    path: 'product/edit/:id',
    loadComponent: () => import('./features/products/product-form/product-form').then(m => m.ProductForm),
    canActivate: [AuthGuard]
  },
  {
    path: 'category-list',
    loadComponent: () => import('./features/categories/category-list/category-list').then(m => m.CategoryList),
    canActivate: [AuthGuard]
  },
  {
    path: 'category/create',
    loadComponent: () => import('./features/categories/category-form/category-form').then(m => m.CategoryForm),
    canActivate: [AuthGuard]
  },
  {
    path: 'category/edit/:id',
    loadComponent: () => import('./features/categories/category-form/category-form').then(m => m.CategoryForm),
    canActivate: [AuthGuard]
  },
  { 
    path: 'weekly-menu',
    loadComponent: () => import('./features/weekly-menu/weekly-menu').then(m => m.WeeklyMenu),
    canActivate: [AuthGuard]
  },
  { 
    path: 'contacts',
    loadComponent: () => import('./features/contact/contact-list').then(m => m.ContactList),
    canActivate: [AuthGuard]
  },
  {
    path: 'reservations',
    loadComponent: () => import('./features/reservation/reservation-list').then(m => m.ReservationList),
    canActivate: [AuthGuard]
  },
  { path: '**', redirectTo: '/dashboard' }
];