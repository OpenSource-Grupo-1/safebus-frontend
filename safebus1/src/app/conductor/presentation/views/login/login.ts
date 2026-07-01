import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { ConductorApiEndpoint } from '../../../infrastructure/conductor-api-endpoint';
import { ConductorStateService } from '../../../infrastructure/conductor-state.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatIconModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private router   = inject(Router);
  private api      = inject(ConductorApiEndpoint);
  private state    = inject(ConductorStateService);

  codigoEmpleado = signal('');
  errors = signal<string[]>([]);
  loading = signal(false);

  readonly errorList = [
    { icon: 'error', color: '#e8002a', title: 'Código inválido', desc: 'La firma digital no coincide con los registros actuales.' },
    { icon: 'info',  color: '#888',    title: 'Conductor no autorizado', desc: 'Su perfil no tiene permisos para esta zona operativa.' },
    { icon: 'warning', color: '#f0a000', title: 'Conflicto de vehículo', desc: 'El vehículo #SB-902 ya tiene un conductor asignado.' },
  ];

  openScanner() {
    this.router.navigate(['/conductor/qr-scanner']);
  }

verify() {
  const code = this.codigoEmpleado();
  if (!code.trim()) { this.errors.set(['empty']); return; }
  this.loading.set(true);
  this.errors.set([]);
  this.api.verifyByCode(code).subscribe({
    next: (conductor) => {
      this.loading.set(false);
      if (conductor) {
        this.state.setConductor(conductor);
        this.router.navigate(['/conductor/access-authorized']);
      } else {
        this.errors.set(['invalid']);
      }
    },
    error: () => {
      this.loading.set(false);
      this.errors.set(['invalid']);
    }
  });
}
}
