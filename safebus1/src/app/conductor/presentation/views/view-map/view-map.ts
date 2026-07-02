import { Component, inject, effect, AfterViewInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { ConductorStateService } from '../../../infrastructure/conductor-state.service';
import { FleetTrackingService } from '../../../../shared/infrastructure/fleet-tracking.service';

declare const L: any;

@Component({
  selector: 'app-view-map',
  standalone: true,
  imports: [MatIconModule, DecimalPipe],
  templateUrl: './view-map.html',
  styleUrl: './view-map.css',
})
export class ViewMap implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  readonly state = inject(ConductorStateService);
  private fleet  = inject(FleetTrackingService);

  tiempoStr = this.state.tiempoStr;
  distancia = this.state.distanciaKm;

  private map: any;
  private marker: any;
  private codigoEmpleado = '';

  constructor() {
    // Cada vez que la flota se mueve, movemos SOLO el marcador (sin
    // recentrar la camara), para que se vea el bus desplazándose de verdad
    effect(() => {
      const unidad = this.fleet.unidades().find(u => u.codigoEmpleado === this.codigoEmpleado);
      if (unidad && this.marker) {
        this.marker.setLatLng([unidad.lat, unidad.lng]);
      }
    });
  }

  ngAfterViewInit() {
    this.codigoEmpleado = this.state.conductorActual()?.codigoEmpleado ?? '';
    const unidad = this.fleet.getUnidadByCodigo(this.codigoEmpleado);
    const lat = unidad?.lat ?? -12.0464;
    const lng = unidad?.lng ?? -77.0428;

    this.map = L.map('conductor-map', { zoomControl: true }).setView([lat, lng], 15);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(this.map);

    const icon = L.divIcon({ className: 'bus-marker-conductor', html: '<div class="bus-dot"></div>', iconSize: [18, 18] });
    this.marker = L.marker([lat, lng], { icon }).addTo(this.map);
  }

  ngOnDestroy() {
    if (this.map) this.map.remove();
  }

  goBack() { this.router.navigate(['/conductor/dashboard']); }
}
