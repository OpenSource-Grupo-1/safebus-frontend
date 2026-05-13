import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { ConductorStateService } from '../../../infrastructure/conductor-state.service';

@Component({
  selector: 'app-view-map',
  standalone: true,
  imports: [MatIconModule, DecimalPipe],
  templateUrl: './view-map.html',
  styleUrl: './view-map.css',
})
export class ViewMap implements OnInit, OnDestroy {
  private router = inject(Router);
  private state  = inject(ConductorStateService);

  tiempoStr = signal('00:00:00');
  distancia = signal(0);
  private timer: ReturnType<typeof setInterval> | null = null;
  private seconds = 0;

  ngOnInit() {
    const t = this.state.turnoActual();
    if (t) { this.seconds = t.tiempoSegundos; this.distancia.set(t.distanciaKm); }
    this.tiempoStr.set(this.formatTime(this.seconds));
    this.timer = setInterval(() => {
      this.seconds++;
      this.tiempoStr.set(this.formatTime(this.seconds));
      this.distancia.update(v => +(v + 0.003).toFixed(3));
    }, 1000);
  }

  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }

  private formatTime(s: number): string {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  }

  goBack() { this.router.navigate(['/conductor/dashboard']); }
}
