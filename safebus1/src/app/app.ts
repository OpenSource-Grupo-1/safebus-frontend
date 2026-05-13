import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, TranslateModule],
  template: `<router-outlet />`,
  styles: [`
    :host { display: block; min-height: 100vh; background: #0a0a0a; }
  `],
})
export class App {
  title = 'SafeBus';
}
