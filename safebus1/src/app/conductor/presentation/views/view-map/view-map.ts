import { Component, inject, signal, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
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
export class ViewMap implements OnInit, AfterViewInit, OnDestroy {
  private router = inject(Router);
  private state  = inject(ConductorStateService);
  private fleet  = inject(FleetTrackingService);

  tiempoStr = signal('00:00:00');
  distancia = signal(0);

  private timer: ReturnType<typeof setInterval> | null = null;
  private seconds = 0;
  private codigoEmpleado = '';
  private map: any;
  private marker: any;

  ngOnInit() {
    const t = this.state.turnoActual();
    if (t) { this.seconds = t.tiempoSegundos; this.distancia.set(t.distanciaKm); }
    this.tiempoStr.set(this.formatTime(this.seconds));
    this.codigoEmpleado = this.state.conductorActual()?.codigoEmpleado ?? '';

    this.timer = setInterval(() => {
      this.seconds++;
      this.tiempoStr.set(this.formatTime(this.seconds));

      const deltaKm = 0.003;
      this.distancia.update(v => +(v + deltaKm).toFixed(3));

      if (this.codigoEmpleado) {
        this.fleet.moverUnidadPorDistancia(this.codigoEmpleado, deltaKm);
      }
      this.actualizarMarcador();
    }, 1000);
  }

  ngAfterViewInit() {
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

  private actualizarMarcador() {
    const unidad = this.fleet.getUnidadByCodigo(this.codigoEmpleado);
    if (unidad && this.marker && this.map) {
      const nuevaPos: [number, number] = [unidad.lat, unidad.lng];
      this.marker.setLatLng(nuevaPos);
      this.map.panTo(nuevaPos, { animate: true, duration: 1 });
    }
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.map) this.map.remove();
  }

  private formatTime(s: number): string {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  }

  goBack() { this.router.navigate(['/conductor/dashboard']); }
}
