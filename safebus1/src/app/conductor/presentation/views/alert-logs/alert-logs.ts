import { Component, inject, signal, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DatePipe, DecimalPipe } from '@angular/common';
import { ConductorApi } from '../../../infrastructure/conductor-api';

@Component({
  selector: 'app-alert-logs',
  standalone: true,
  imports: [MatIconModule, DatePipe, DecimalPipe],
  template: `
<div class="al-root">
  <div class="al-header">
    <h2 class="al-title">ALERT LOGS</h2>
    <p class="al-sub">Registro de alertas enviadas durante el servicio</p>
  </div>

  <!-- Summary -->
  <div class="al-summary">
    <div class="sum-card">
      <mat-icon style="color:var(--sb-red)">emergency</mat-icon>
      <span class="sum-val" style="color:var(--sb-red)">{{ panicCount() }}</span>
      <span class="sb-label">PÁNICO</span>
    </div>
    <div class="sum-card">
      <mat-icon style="color:#ff6d00">speed</mat-icon>
      <span class="sum-val" style="color:#ff6d00">{{ velCount() }}</span>
      <span class="sb-label">VELOCIDAD</span>
    </div>
    <div class="sum-card">
      <mat-icon style="color:#f0a000">alt_route</mat-icon>
      <span class="sum-val" style="color:#f0a000">{{ desvioCount() }}</span>
      <span class="sb-label">DESVÍOS</span>
    </div>
    <div class="sum-card">
      <mat-icon style="color:var(--sb-accent)">people</mat-icon>
      <span class="sum-val" style="color:var(--sb-accent)">{{ pasajCount() }}</span>
      <span class="sb-label">PASAJEROS</span>
    </div>
  </div>

  <!-- Logs table -->
  <div class="sb-card al-table-card">
    <p class="section-label">HISTORIAL DE ALERTAS</p>
    @if (loading()) {
      <div class="loading-row"><mat-icon class="spin">sync</mat-icon> Cargando alertas...</div>
    } @else if (alertas().length === 0) {
      <div class="no-alerts">
        <mat-icon>check_circle</mat-icon>
        <p>Sin alertas registradas en este turno</p>
      </div>
    } @else {
      <div class="al-table">
        <div class="al-header-row">
          <span>NIVEL</span><span>TIPO</span><span>DESCRIPCIÓN</span>
          <span>TIMESTAMP</span><span>COORDS</span><span>ESTADO</span>
        </div>
        @for (a of alertas(); track a.id) {
          <div class="al-row">
            <span class="nivel-badge" [style.color]="nivelColor(a.estadoCentral)">{{ a.estadoCentral }}</span>
            <span class="al-tipo">ALERTA</span>
            <span class="al-desc">Alerta #{{ a.id }} — Unidad BUS-7729</span>
            <span class="al-mono">{{ a.timestamp | date:'dd/MM HH:mm' }}</span>
            <span class="al-mono">{{ a.latitud | number:'1.2-2' }}, {{ a.longitud | number:'1.2-2' }}</span>
            <span class="al-estado" [class.resuelta]="a.resuelta">{{ a.resuelta ? 'RESUELTA' : 'ACTIVA' }}</span>
          </div>
        }
      </div>
    }
  </div>
</div>`,
  styles: [`
.al-root { padding:20px; display:flex; flex-direction:column; gap:16px; height:calc(100vh - 48px); overflow-y:auto; }
.al-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:22px; color:var(--sb-white); }
.al-sub { font-size:12px; color:var(--sb-gray); margin-top:4px; }
.al-summary { display:grid; grid-template-columns:repeat(4,1fr); gap:12px; }
.sum-card { background:var(--sb-bg-card); border:1px solid var(--sb-border); padding:20px 16px; display:flex; flex-direction:column; align-items:center; gap:8px; }
.sum-card mat-icon { font-size:28px; width:28px; height:28px; }
.sum-val { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:36px; line-height:1; }
.section-label { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:11px; letter-spacing:0.2em; color:var(--sb-gray); text-transform:uppercase; margin-bottom:14px; }
.loading-row { display:flex; align-items:center; gap:8px; color:var(--sb-gray); font-size:13px; padding:20px 0; }
.spin { animation:spin 1s linear infinite; }
@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
.no-alerts { display:flex; flex-direction:column; align-items:center; gap:12px; padding:40px; color:var(--sb-accent); }
.no-alerts mat-icon { font-size:40px; width:40px; height:40px; }
.no-alerts p { font-size:13px; color:var(--sb-gray); }
.al-table { }
.al-header-row,.al-row { display:grid; grid-template-columns:1fr 1fr 2fr 1.2fr 1.5fr 1fr; padding:8px 12px; border-bottom:1px solid var(--sb-border); gap:8px; align-items:center; }
.al-header-row { background:var(--sb-bg-card2); }
.al-header-row span { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:10px; letter-spacing:0.15em; color:var(--sb-gray); }
.nivel-badge { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:11px; }
.al-tipo { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:12px; color:var(--sb-white); }
.al-desc { font-size:11px; color:var(--sb-gray); }
.al-mono { font-family:'Share Tech Mono',monospace; font-size:10px; color:var(--sb-gray); }
.al-estado { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:11px; color:var(--sb-red); }
.al-estado.resuelta { color:var(--sb-accent); }
`]
})
export class AlertLogs implements OnInit {
  private api = inject(ConductorApi);
  alertas = signal<any[]>([]);
  loading = signal(true);

  get panicCount()  { return () => this.alertas().filter(a => a.estadoCentral === 'CRITICO').length; }
  get velCount()    { return () => this.alertas().filter(a => a.estadoCentral === 'ALTO').length; }
  get desvioCount() { return () => this.alertas().filter(a => a.estadoCentral === 'BAJO').length; }
  get pasajCount()  { return () => this.alertas().filter(a => a.estadoCentral === 'MEDIO').length; }

  ngOnInit() {
    this.api.getAlertas().subscribe({
      next: (list) => { this.alertas.set(list); this.loading.set(false); },
      error: () => {
        // Use mock data if API not available
        this.alertas.set([
          { id:1, estadoCentral:'CRITICO', latitud:-12.156,  longitud:-76.972, timestamp:new Date('2025-04-26T07:05:00'), resuelta:false },
          { id:2, estadoCentral:'ALTO',    latitud:-12.158,  longitud:-76.975, timestamp:new Date('2025-04-26T07:02:00'), resuelta:false },
          { id:3, estadoCentral:'MEDIO',   latitud:-12.156,  longitud:-76.972, timestamp:new Date('2025-04-26T07:30:00'), resuelta:false },
          { id:4, estadoCentral:'BAJO',    latitud:-12.051,  longitud:-77.048, timestamp:new Date('2025-04-25T07:00:00'), resuelta:true  },
        ]);
        this.loading.set(false);
      }
    });
  }

  nivelColor(nivel: string): string {
    return nivel === 'CRITICO' ? 'var(--sb-red)' : nivel === 'ALTO' ? '#ff6d00' : nivel === 'MEDIO' ? '#f0a000' : 'var(--sb-gray)';
  }
}
