import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive, MatIconModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout {
  navItems = signal([
    { icon: 'location_on',    label: 'CENTRO DE CONTROL',    route: '/admin/control-center' },
    { icon: 'people',         label: 'GESTIÓN CONDUCTORES',  route: '/admin/drivers' },
    { icon: 'directions_bus', label: 'ASIG. UNIDADES',       route: '/admin/units' },
    { icon: 'notifications',  label: 'NOTIFICACIONES',       route: '/admin/notifications' },
    { icon: 'history',        label: 'HISTORIAL TURNOS',     route: '/admin/shifts' },
    { icon: 'bar_chart',      label: 'IMPACTO NÚMEROS',      route: '/admin/impact' },
  ]);
}
