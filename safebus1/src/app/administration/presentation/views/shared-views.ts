import { Component, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe } from '@angular/common';
import { AdminDataService } from '../../infrastructure/admin-data.service';

// ---- SHIFT HISTORY ----
@Component({
  selector: 'app-shift-history',
  standalone: true,
  imports: [MatIconModule, DecimalPipe],
  template: `
<div class="sh-root">
  <h2 class="page-title">HISTORIAL DE TURNOS</h2>
  <div class="shift-table">
    <div class="sh-header">
      <span>CONDUCTOR</span><span>BUS</span><span>RUTA</span><span>FECHA</span>
      <span>KM</span><span>PASAJEROS</span><span>RECAUDACIÓN</span><span>ESTADO</span>
    </div>
    @for (t of historial(); track t.id) {
      <div class="sh-row">
        <span class="sh-name">{{ t.conductor }}</span>
        <span class="sh-mono">{{ t.bus }}</span>
        <span class="sh-mono">{{ t.ruta }}</span>
        <span class="sh-mono">{{ t.fecha }}</span>
        <span class="sh-val">{{ t.distancia | number:'1.1-1' }}</span>
        <span class="sh-val">{{ t.pasajeros }}</span>
        <span class="sh-accent">\${{ t.recaudacion | number:'1.0-0' }}</span>
        <span class="sh-estado" [style.color]="estadoColor(t.estado)">{{ t.estado }}</span>
      </div>
    }
  </div>
</div>`,
  styles: [`
.sh-root { padding: 20px; }
.page-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:22px; color:var(--sb-white); margin-bottom:20px; }
.shift-table { background:var(--sb-bg-card); border:1px solid var(--sb-border); }
.sh-header,.sh-row { display:grid; grid-template-columns:2fr 1fr 1fr 1fr 1fr 1fr 1fr 1fr; padding:10px 16px; border-bottom:1px solid var(--sb-border); align-items:center; gap:8px; }
.sh-header { background:var(--sb-bg-card2); }
.sh-header span { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:10px; letter-spacing:0.15em; color:var(--sb-gray); }
.sh-row:hover { background:var(--sb-bg-card2); }
.sh-name { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; color:var(--sb-white); }
.sh-mono { font-family:'Share Tech Mono',monospace; font-size:11px; color:var(--sb-gray); }
.sh-val { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; color:var(--sb-white); }
.sh-accent { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:13px; color:var(--sb-accent); }
.sh-estado { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:11px; }
`]
})
export class ShiftHistory {
  private svc = inject(AdminDataService);
  historial   = signal(this.svc.getHistorial());
  estadoColor(e: string) { return e === 'FINALIZADO' ? 'var(--sb-accent)' : e === 'ALERTA' ? 'var(--sb-red)' : 'var(--sb-gray)'; }
}

// ---- UNIT ASSIGNMENT ----
@Component({
  selector: 'app-unit-assignment',
  standalone: true,
  imports: [MatIconModule],
  template: `
<div class="ua-root">
  <h2 class="page-title">ASIGNACIÓN DE UNIDADES</h2>
  <div class="unit-grid">
    @for (u of unidades(); track u.id) {
      <div class="unit-card" [class.alert]="u.estado === 'ALERTA'">
        <div class="uc-top">
          <mat-icon [style.color]="estadoColor(u.estado)">directions_bus</mat-icon>
          <span class="uc-placa">{{ u.placa }}</span>
          <span class="uc-estado" [style.color]="estadoColor(u.estado)">{{ u.estado }}</span>
        </div>
        <p class="uc-conductor">{{ u.conductor }}</p>
        <p class="uc-ruta">Ruta: <strong>{{ u.ruta }}</strong></p>
        <div class="uc-stats">
          <span><mat-icon>people</mat-icon> {{ u.pasajeros }}</span>
          <span><mat-icon>speed</mat-icon> {{ u.velocidad }} km/h</span>
        </div>
        <button class="uc-btn">REASIGNAR</button>
      </div>
    }
  </div>
</div>`,
  styles: [`
.ua-root { padding: 20px; }
.page-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:22px; color:var(--sb-white); margin-bottom:20px; }
.unit-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:12px; }
.unit-card { background:var(--sb-bg-card); border:1px solid var(--sb-border); padding:16px; }
.unit-card.alert { border-color:var(--sb-red); }
.uc-top { display:flex; align-items:center; gap:8px; margin-bottom:10px; }
.uc-top mat-icon { font-size:20px; width:20px; height:20px; }
.uc-placa { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:14px; color:var(--sb-white); flex:1; }
.uc-estado { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:10px; }
.uc-conductor { font-size:12px; color:var(--sb-gray); margin-bottom:4px; }
.uc-ruta { font-size:12px; color:var(--sb-gray); margin-bottom:10px; }
.uc-ruta strong { color:var(--sb-accent); }
.uc-stats { display:flex; gap:12px; margin-bottom:12px; }
.uc-stats span { display:flex; align-items:center; gap:4px; font-size:11px; color:var(--sb-gray); }
.uc-stats mat-icon { font-size:14px; width:14px; height:14px; }
.uc-btn { width:100%; background:transparent; border:1px solid var(--sb-border2); color:var(--sb-gray); font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:11px; letter-spacing:0.1em; padding:7px; cursor:pointer; transition:all 0.15s; }
.uc-btn:hover { border-color:var(--sb-accent); color:var(--sb-accent); }
`]
})
export class UnitAssignment {
  private svc = inject(AdminDataService);
  unidades    = signal(this.svc.getUnidades());
  estadoColor(e: string) { return e === 'ACTIVO' ? 'var(--sb-accent)' : e === 'ALERTA' ? 'var(--sb-red)' : 'var(--sb-gray)'; }
}

// ---- NOTIFICATIONS ----
@Component({
  selector: 'app-notifications',
  standalone: true,
  imports: [MatIconModule],
  template: `
<div class="notif-root">
  <h2 class="page-title">NOTIFICACIONES</h2>
  <div class="notif-grid">
    <div class="sb-card">
      <p class="section-label">DESTINATARIOS ACTIVOS</p>
      @for (r of recipients(); track r.id) {
        <div class="recip-row">
          <mat-icon [style.color]="r.active ? 'var(--sb-accent)' : 'var(--sb-gray)'">{{ r.icon }}</mat-icon>
          <div class="recip-info">
            <p class="recip-name">{{ r.name }}</p>
            <p class="recip-type">{{ r.type }}</p>
          </div>
          <span class="recip-status" [style.color]="r.active ? 'var(--sb-accent)' : 'var(--sb-gray)'">
            {{ r.active ? 'ACTIVO' : 'INACTIVO' }}
          </span>
        </div>
      }
    </div>
    <div class="sb-card">
      <p class="section-label">REGISTRO DE ENTREGAS</p>
      @for (n of notifs(); track n.id) {
        <div class="notif-row">
          <div class="notif-dot" [style.background]="n.tipo === 'PÁNICO' ? 'var(--sb-red)' : 'var(--sb-accent)'"></div>
          <div>
            <p class="notif-msg">{{ n.mensaje }}</p>
            <p class="notif-hora">{{ n.hora }} — {{ n.bus }}</p>
          </div>
          <mat-icon [style.color]="n.entregado ? 'var(--sb-accent)' : 'var(--sb-gray)'">
            {{ n.entregado ? 'check_circle' : 'pending' }}
          </mat-icon>
        </div>
      }
    </div>
  </div>
</div>`,
  styles: [`
.notif-root { padding: 20px; }
.page-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:22px; color:var(--sb-white); margin-bottom:20px; }
.notif-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
.section-label { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:11px; letter-spacing:0.2em; color:var(--sb-gray); text-transform:uppercase; margin-bottom:14px; }
.recip-row,.notif-row { display:flex; align-items:center; gap:12px; padding:10px 0; border-bottom:1px solid var(--sb-border); }
.recip-row:last-child,.notif-row:last-child { border-bottom:none; }
.recip-row mat-icon { font-size:22px; width:22px; height:22px; }
.recip-info { flex:1; }
.recip-name { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:13px; color:var(--sb-white); }
.recip-type { font-size:11px; color:var(--sb-gray); }
.recip-status { font-family:'Barlow Condensed',sans-serif; font-weight:800; font-size:10px; }
.notif-dot { width:8px; height:8px; border-radius:50%; flex-shrink:0; }
.notif-msg { font-size:12px; color:var(--sb-white); flex:1; }
.notif-hora { font-size:10px; color:var(--sb-gray); }
`]
})
export class Notifications {
  recipients = signal([
    { id:1, name:'Central PNP Lima Norte', type:'POLICÍA', icon:'local_police', active:true },
    { id:2, name:'Central SafeBus OPS',    type:'OPERACIONES', icon:'headset_mic', active:true },
    { id:3, name:'Empresa Trans Lima SAC', type:'EMPRESA', icon:'business', active:true },
    { id:4, name:'Gerencia Operativa',     type:'GESTIÓN', icon:'manage_accounts', active:false },
  ]);
  notifs = signal([
    { id:1, tipo:'PÁNICO',    mensaje:'Alerta de pánico enviada — GHI-9012', hora:'07:05', bus:'GHI-9012', entregado:true },
    { id:2, tipo:'VELOCIDAD', mensaje:'Velocidad excesiva detectada — GHI-9012', hora:'07:02', bus:'GHI-9012', entregado:true },
    { id:3, tipo:'PASAJEROS', mensaje:'Sobrecapacidad detectada — GHI-9012', hora:'07:30', bus:'GHI-9012', entregado:false },
    { id:4, tipo:'DESVÍO',    mensaje:'Desvío de ruta resuelto — ABC-1234', hora:'06:50', bus:'ABC-1234', entregado:true },
  ]);
}

// ---- IMPACT NUMBERS ----
@Component({
  selector: 'app-impact-numbers',
  standalone: true,
  imports: [MatIconModule],
  template: `
<div class="impact-root">
  <h2 class="page-title">IMPACTO DE NÚMEROS</h2>
  <div class="kpi-grid">
    @for (k of kpis(); track k.label) {
      <div class="impact-card">
        <mat-icon [style.color]="k.color">{{ k.icon }}</mat-icon>
        <span class="impact-val" [style.color]="k.color">{{ k.value }}</span>
        <span class="impact-label">{{ k.label }}</span>
        <span class="impact-desc">{{ k.desc }}</span>
      </div>
    }
  </div>
  <div class="trend-section sb-card">
    <p class="section-label">TENDENCIA SEMANAL — ALERTAS</p>
    <div class="trend-bars">
      @for (d of trend(); track d.day) {
        <div class="trend-col">
          <div class="trend-bar" [style.height.%]="d.pct" [style.background]="d.pct > 70 ? 'var(--sb-red)' : 'var(--sb-accent)'"></div>
          <span class="trend-day">{{ d.day }}</span>
          <span class="trend-val">{{ d.val }}</span>
        </div>
      }
    </div>
  </div>
</div>`,
  styles: [`
.impact-root { padding: 20px; }
.page-title { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:22px; color:var(--sb-white); margin-bottom:20px; }
.kpi-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(180px,1fr)); gap:12px; margin-bottom:20px; }
.impact-card { background:var(--sb-bg-card); border:1px solid var(--sb-border); padding:20px 16px; display:flex; flex-direction:column; gap:6px; }
.impact-card mat-icon { font-size:28px; width:28px; height:28px; }
.impact-val { font-family:'Barlow Condensed',sans-serif; font-weight:900; font-size:36px; line-height:1; }
.impact-label { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:11px; letter-spacing:0.15em; color:var(--sb-white); text-transform:uppercase; }
.impact-desc { font-size:11px; color:var(--sb-gray); line-height:1.4; }
.section-label { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:11px; letter-spacing:0.2em; color:var(--sb-gray); text-transform:uppercase; margin-bottom:16px; }
.trend-bars { display:flex; align-items:flex-end; gap:12px; height:120px; }
.trend-col { display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; height:100%; justify-content:flex-end; }
.trend-bar { width:100%; min-height:4px; border-radius:2px 2px 0 0; transition:height 0.3s; }
.trend-day { font-family:'Barlow Condensed',sans-serif; font-size:11px; color:var(--sb-gray); }
.trend-val { font-family:'Barlow Condensed',sans-serif; font-weight:700; font-size:12px; color:var(--sb-white); }
`]
})
export class ImpactNumbers {
  kpis = signal([
    { icon:'directions_bus', value:'98%', label:'Rutas Operativas', desc:'Rutas con servicio activo y monitoreado', color:'var(--sb-accent)' },
    { icon:'people',         value:'+1,000', label:'Conductores', desc:'Conductores protegidos con el sistema', color:'var(--sb-accent)' },
    { icon:'trending_down',  value:'-40%', label:'Incidentes', desc:'Reducción de incidentes en últimos 6 meses', color:'var(--sb-accent)' },
    { icon:'warning',        value:'3', label:'Alertas Activas', desc:'Alertas pendientes de resolución hoy', color:'var(--sb-red)' },
    { icon:'timer',          value:'1.8 min', label:'T. Respuesta', desc:'Tiempo promedio de respuesta a alertas', color:'var(--sb-accent)' },
    { icon:'verified_user',  value:'100%', label:'Verificaciones', desc:'Conductores verificados con QR hoy', color:'var(--sb-accent)' },
  ]);
  trend = signal([
    {day:'Lun', val:5, pct:40},{day:'Mar', val:3, pct:24},{day:'Mié', val:8, pct:64},
    {day:'Jue', val:2, pct:16},{day:'Vie', val:9, pct:72},{day:'Sáb', val:6, pct:48},{day:'Dom', val:1, pct:8},
  ]);
}
