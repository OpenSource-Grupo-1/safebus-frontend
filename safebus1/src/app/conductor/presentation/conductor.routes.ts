import { Routes } from '@angular/router';

const login           = () => import('./views/login/login').then(m => m.Login);
const qrScanner       = () => import('./views/qr-scanner/qr-scanner').then(m => m.QrScanner);
const accessAuthorized= () => import('./views/access-authorized/access-authorized').then(m => m.AccessAuthorized);
const panicAlert      = () => import('./views/panic-alert/panic-alert').then(m => m.PanicAlert);
const conductorLayout = () => import('./components/conductor-layout/conductor-layout').then(m => m.ConductorLayout);
const dashboard       = () => import('./views/dashboard/dashboard').then(m => m.Dashboard);
const viewMap         = () => import('./views/view-map/view-map').then(m => m.ViewMap);
const serviceSummary  = () => import('./views/service-summary/service-summary').then(m => m.ServiceSummary);
const passengers      = () => import('./views/passenger-count/passenger-count').then(m => m.PassengerCount);
const apiConsole      = () => import('./views/api-console/api-console').then(m => m.ApiConsole);
const alertLogs       = () => import('./views/alert-logs/alert-logs').then(m => m.AlertLogs);

export const conductorRoutes: Routes = [
  { path: 'login',             loadComponent: login },
  { path: 'qr-scanner',        loadComponent: qrScanner },
  { path: 'access-authorized', loadComponent: accessAuthorized },
  { path: 'panic-alert',       loadComponent: panicAlert },
  {
    path: '',
    loadComponent: conductorLayout,
    children: [
      { path: 'dashboard',       loadComponent: dashboard },
      { path: 'admin', redirectTo: '/admin' },
      { path: 'view-map',        loadComponent: viewMap },
      { path: 'service-summary', loadComponent: serviceSummary },
      { path: 'passengers',      loadComponent: passengers },
      { path: 'api-console',     loadComponent: apiConsole },
      { path: 'alert-logs',      loadComponent: alertLogs },
      { path: '',  redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];
