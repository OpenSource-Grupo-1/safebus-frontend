import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { FormsModule } from '@angular/forms';
import { DecimalPipe } from '@angular/common';
import { ConductorStateService } from '../../../infrastructure/conductor-state.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [MatIconModule, MatCheckboxModule, FormsModule, DecimalPipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit, OnDestroy {
  private router  = inject(Router);
  readonly state  = inject(ConductorStateService);

  tiempoStr   = signal('00:00:00');
  distancia   = signal(0);
  pasajeros   = signal(0);
  recaudacion = signal(0);

  check1 = signal(false);
  check2 = signal(false);
  check3 = signal(false);
  showFinishModal = signal(false);

  gpsStatus  = signal('ESTABLE');
  telStatus  = signal('SINCRO');
  cloudStatus= signal('ACTIVA');

  private timer: ReturnType<typeof setInterval> | null = null;
  private seconds = 0;

  ngOnInit() {
    this.timer = setInterval(() => {
      this.seconds++;
      this.tiempoStr.set(this.formatTime(this.seconds));
      this.distancia.update(v => +(v + 0.003).toFixed(3));
      if (this.seconds % 15 === 0) {
        this.pasajeros.update(v => v + Math.floor(Math.random() * 3));
        this.recaudacion.update(v => +(v + (Math.random() * 2.5)).toFixed(2));
      }
      const t = this.state.turnoActual();
      if (t) {
        t.tiempoSegundos = this.seconds;
        t.distanciaKm = this.distancia();
        t.pasajeros   = this.pasajeros();
        t.recaudacion = this.recaudacion();
      }
    }, 1000);
  }

  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }

  private formatTime(s: number): string {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  }

  viewMap()    { this.router.navigate(['/conductor/view-map']); }
  openFinish() { this.showFinishModal.set(true); }
  cancelFinish() { this.showFinishModal.set(false); }

  confirmFinish() {
    this.state.finalizarTurno();
    this.showFinishModal.set(false);
    this.router.navigate(['/conductor/service-summary']);
  }
}
