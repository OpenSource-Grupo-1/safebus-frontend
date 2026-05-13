import { Component, inject, signal, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-panic-alert',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './panic-alert.html',
  styleUrl: './panic-alert.css',
})
export class PanicAlert implements OnInit, OnDestroy {
  private router  = inject(Router);
  coords          = signal('4.7110° N, 74.0721° W');
  cancelCountdown = signal(5);
  private timer: ReturnType<typeof setInterval> | null = null;

  ngOnInit() {
    this.timer = setInterval(() => {
      this.cancelCountdown.update(v => v > 0 ? v - 1 : 0);
    }, 1000);
  }
  ngOnDestroy() { if (this.timer) clearInterval(this.timer); }

  cancel() { this.router.navigate(['/conductor/dashboard']); }
  ok()     { this.router.navigate(['/conductor/dashboard']); }
}
