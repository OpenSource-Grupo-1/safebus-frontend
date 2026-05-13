import { Routes } from '@angular/router';

const adminLayout     = () => import('./components/admin-layout/admin-layout').then(m => m.AdminLayout);
const controlCenter   = () => import('./views/control-center/control-center').then(m => m.ControlCenter);
const driverMgmt      = () => import('./views/driver-management/driver-management').then(m => m.DriverManagement);
const unitAssignment  = () => import('./views/shared-views').then(m => m.UnitAssignment);
const notifications   = () => import('./views/shared-views').then(m => m.Notifications);
const shiftHistory    = () => import('./views/shared-views').then(m => m.ShiftHistory);
const impactNumbers   = () => import('./views/shared-views').then(m => m.ImpactNumbers);

export const administrationRoutes: Routes = [
  {
    path: '',
    loadComponent: adminLayout,
    children: [
      { path: 'control-center', loadComponent: controlCenter },
      { path: 'drivers',        loadComponent: driverMgmt },
      { path: 'units',          loadComponent: unitAssignment },
      { path: 'notifications',  loadComponent: notifications },
      { path: 'shifts',         loadComponent: shiftHistory },
      { path: 'impact',         loadComponent: impactNumbers },
      { path: '',  redirectTo: 'control-center', pathMatch: 'full' },
    ],
  },
];
