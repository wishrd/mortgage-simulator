import { Routes } from '@angular/router';
import { mortgagesResolver } from './features/mortgages/mortgages.resolver';
import { mortgageFormResolver } from './features/mortgage-form/mortgage-form.resolver';
import { mortgageDetailResolver } from './features/mortgage-detail/mortgage-detail.resolver';

export const routes: Routes = [
  {
    path: 'mortgages',
    resolve: {
      mortgages: mortgagesResolver,
    },
    loadComponent: () => import('./features/mortgages/mortgages.component').then(c => c.MortgagesComponent),
  },
  {
    path: 'mortgages/new',
    loadComponent: () => import('./features/mortgage-form/mortgage-form.component').then(c => c.MortgageFormComponent),
  },
  {
    path: 'mortgages/:id/edit',
    resolve: {
      mortgage: mortgageFormResolver,
    },
    loadComponent: () => import('./features/mortgage-form/mortgage-form.component').then(c => c.MortgageFormComponent),
  },
  {
    path: 'mortgages/:id/detail',
    resolve: {
      mortgage: mortgageDetailResolver,
    },
    loadComponent: () => import('./features/mortgage-detail/mortgage-detail.component').then(c => c.MortgageDetailComponent),
  },
  {
    path: '**',
    redirectTo: 'mortgages',
  }
];
