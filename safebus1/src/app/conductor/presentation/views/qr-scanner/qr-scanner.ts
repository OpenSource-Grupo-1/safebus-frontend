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

  private interval: ReturnType<typeof setInterval>;

  constructor() {
    // simulate scan line animation + auto-detect after 3s
    this.interval = setInterval(() => {
      this.scanLine.update(v => (v + 3) % 100);
    }, 30);

    setTimeout(() => this.simulateScan(), 3000);
  }

  private simulateScan() {
    this.api.verifyByCode('QR-SF-90210-TX').subscribe(c => {
      if (c) { this.conductorFound.set(c); this.state.setConductor(c); }
    });
  }

  validate() {
    const code = this.manualCode();
    if (!code.trim()) return;
    this.api.verifyByCode(code).subscribe(c => {
      if (c) { this.conductorFound.set(c); this.state.setConductor(c); }
    });
  }

  startShift() {
    this.router.navigate(['/conductor/access-authorized']);
  }

  ngOnDestroy() { clearInterval(this.interval); }
}
