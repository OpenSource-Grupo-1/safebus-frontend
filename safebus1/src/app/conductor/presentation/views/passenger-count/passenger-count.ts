import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe, DatePipe } from '@angular/common';
import { ConductorStateService } from '../../../infrastructure/conductor-state.service';
import { ConductorApi } from '../../../infrastructure/conductor-api';
import { Pasajero } from '../../../domain/model/pasajero.entity';

@Component({
  selector: 'app-passenger-count',
  standalone: true,
  imports: [MatIconModule, DecimalPipe, DatePipe],
  templateUrl: './passenger-count.html',
  styleUrl: './passenger-count.css',
})
export class PassengerCount implements OnInit, OnDestroy {
  private state = inject(ConductorStateService);
  private api   = inject(ConductorApi);

  totalAbordo    = signal(0);
  totalAbordaron = signal(0);
  totalBajaron   = signal(0);
  anomalia       = signal(false);
  historial      = signal<Pasajero[]>([]);
  capacidadMax   = signal(80);

  private timer: ReturnType<typeof setInterval> | null = null;
  private entradaTimer: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    const t = this.state.turnoActual();
    if (t) { this.totalAbordo.set(t.pasajeros); }

    // Load history from API
    this.api.getPasajeros().subscribe({
      next: (list) => this.historial.set(list.slice(-5)),
      error: () => {}
    });

    // Simulate real-time passenger changes
    this.entradaTimer = setInterval(() => {
      const entradas = Math.floor(Math.random() * 4);
      const salidas  = Math.floor(Math.random() * 3);
      this.totalAbordaron.update(v => v + entradas);
      this.totalBajaron.update(v => v + salidas);
      const nuevo = Math.max(0, this.totalAbordo() + entradas - salidas);
      this.totalAbordo.set(nuevo);
      this.anomalia.set(nuevo > this.capacidadMax() * 0.9);
      const t2 = this.state.turnoActual();
      if (t2) t2.pasajeros = nuevo;
    }, 8000);
  }

  ngOnDestroy() {
    if (this.timer) clearInterval(this.timer);
    if (this.entradaTimer) clearInterval(this.entradaTimer);
  }

  get ocupacionPct(): number {
    return Math.min(100, Math.round((this.totalAbordo() / this.capacidadMax()) * 100));
  }
}
