import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavBarComponent],
  template: `
    <div class="app-root-container">
      <app-nav-bar></app-nav-bar>
      <main class="main-content-layout">
        <router-outlet></router-outlet>
      </main>
    </div>
  `,
  styles: [`
    .app-root-container {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
      background-color: #121214;
    }
    .main-content-layout {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
  `]
})
export class AppComponent {
  title = 'AutoMechanic AI';
}
