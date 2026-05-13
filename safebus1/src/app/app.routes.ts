import { Routes } from '@angular/router';

const conductorRoutes      = () => import('./conductor/presentation/conductor.routes').then(m => m.conductorRoutes);
const administrationRoutes = () => import('./administration/presentation/administration.routes').then(m => m.administrationRoutes);
const pageNotFound         = () => import('./shared/presentation/views/page-not-found/page-not-found').then(m => m.PageNotFound);

const baseTitle = 'SafeBus | UrbanGuard';

export const routes: Routes = [
  { path: 'conductor', loadChildren: conductorRoutes,      title: `${baseTitle} - Conductor` },
  { path: 'admin',     loadChildren: administrationRoutes, title: `${baseTitle} - Administración` },
  { path: '',          redirectTo: '/conductor/login',      pathMatch: 'full' },
  { path: '**',        loadComponent: pageNotFound,         title: `${baseTitle} - Not Found` },
];
