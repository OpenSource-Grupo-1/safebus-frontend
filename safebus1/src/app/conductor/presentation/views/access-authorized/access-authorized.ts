import { Component, inject, signal, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { ConductorStateService } from '../../../infrastructure/conductor-state.service';

@Component({
  selector: 'app-access-authorized',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './access-authorized.html',
  styleUrl: './access-authorized.css',
})
export class AccessAuthorized implements OnInit {
  private router = inject(Router);
  private state  = inject(ConductorStateService);

  coords    = signal('4.7110° N, 74.0721° W');
  centralOk = signal(true);
  recording = signal(true);

  ngOnInit() {
    const c = this.state.conductorActual();
    if (!c) this.router.navigate(['/conductor/login']);
    this.state.iniciarTurno('BUS-7729');
  }

  continue() {
    this.router.navigate(['/conductor/dashboard']);
  }
}
