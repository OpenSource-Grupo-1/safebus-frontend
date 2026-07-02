import { Component, inject, signal, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ConductorApiEndpoint } from '../../../infrastructure/conductor-api-endpoint';
import { ConductorStateService } from '../../../infrastructure/conductor-state.service';
import { Conductor } from '../../../domain/model/conductor.entity';

@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './qr-scanner.html',
  styleUrl: './qr-scanner.css',
})
export class QrScanner implements OnDestroy {
  private router = inject(Router);
  private api    = inject(ConductorApiEndpoint);
  private state  = inject(ConductorStateService);

  manualCode     = signal('');
  scanning       = signal(true);
  conductorFound = signal<Conductor | null>(null);
  scanLine       = signal(0);
  errorMsg       = signal('');

  /** Códigos de empleado reales que sí existen en el backend (creados por el seeder). */
  private codigosRegistrados = ['EMP-001', 'EMP-002', 'EMP-003', 'EMP-004', 'EMP-005', 'EMP-006', 'EMP-007'];

  private interval: ReturnType<typeof setInterval>;

  constructor() {
    // animación de la línea de escaneo + auto-detección simulada a los 3s
    this.interval = setInterval(() => {
      this.scanLine.update(v => (v + 3) % 100);
    }, 30);

    setTimeout(() => this.simulateScan(), 3000);
  }

  private simulateScan() {
    if (this.conductorFound()) return; // si ya validó manualmente, no pises el resultado

    const codigoAleatorio = this.codigosRegistrados[Math.floor(Math.random() * this.codigosRegistrados.length)];
    this.api.verifyByCode(codigoAleatorio).subscribe({
      next: (c) => {
        if (c) { this.conductorFound.set(c); this.state.setConductor(c); }
      },
      error: () => { this.errorMsg.set('No se pudo validar el escaneo automático.'); },
    });
  }

  validate() {
    const code = this.manualCode();
    if (!code.trim()) return;
    this.errorMsg.set('');
    this.api.verifyByCode(code).subscribe({
      next: (c) => {
        if (c) {
          this.conductorFound.set(c);
          this.state.setConductor(c);
        } else {
          this.errorMsg.set('Código inválido.');
        }
      },
      error: () => { this.errorMsg.set('Código inválido.'); },
    });
  }

  startShift() {
    this.router.navigate(['/conductor/access-authorized']);
  }

  ngOnDestroy() { clearInterval(this.interval); }
}
