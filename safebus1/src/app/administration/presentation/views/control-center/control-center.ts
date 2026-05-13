import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { AdminDataService } from '../../../infrastructure/admin-data.service';

@Component({
  selector: 'app-control-center',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './control-center.html',
  styleUrl: './control-center.css',
})
export class ControlCenter {
  private svc = inject(AdminDataService);
  unidades = signal(this.svc.getUnidades());
  alertas  = signal(this.svc.getAlertas());

  get activasCnt()  { return this.unidades().filter(u => u.estado === 'ACTIVO').length; }
  get alertaCnt()   { return this.alertas().filter(a => !a.resuelta).length; }
  get pasajerosCnt(){ return this.unidades().reduce((s,u) => s + u.pasajeros, 0); }

  nivelColor(n: string) {
    return n === 'CRITICO' ? '#e8002a' : n === 'ALTO' ? '#ff6d00' : n === 'MEDIO' ? '#f0a000' : '#888';
  }
  estadoColor(e: string) {
    return e === 'ACTIVO' ? 'var(--sb-accent)' : e === 'ALERTA' ? '#e8002a' : 'var(--sb-gray)';
  }

  resolverAlerta(id: number) {
    this.alertas.update(list => list.map(a => a.id === id ? {...a, resuelta: true} : a));
  }
}
