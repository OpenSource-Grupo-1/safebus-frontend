import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { ConductorStateService } from '../../../infrastructure/conductor-state.service';

@Component({
  selector: 'app-service-summary',
  standalone: true,
  imports: [MatIconModule, DecimalPipe],
  templateUrl: './service-summary.html',
  styleUrl: './service-summary.css',
})
export class ServiceSummary {
  private router = inject(Router);
  readonly state = inject(ConductorStateService);

  get turno() { return this.state.turnoActual(); }

  formatTime(s: number): string {
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  }

  newService() {
    this.state.clearConductor();
    this.router.navigate(['/conductor/login']);
  }
}
