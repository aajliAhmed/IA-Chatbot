import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from '../../services/auth.service';
import { VehicleService } from '../../services/vehicle.service';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule, MatTooltipModule],
  template: `
    <mat-toolbar class="glass-header">
      <div class="header-container">
        <div class="logo-area" routerLink="/select">
          <mat-icon class="logo-icon">build_circle</mat-icon>
          <span class="logo-text">AutoMechanic <span class="logo-ai">AI</span></span>
        </div>

        <span class="spacer"></span>

        <div class="header-actions">
          <button
            mat-icon-button
            class="theme-toggle"
            type="button"
            (click)="themeService.toggle()"
            [matTooltip]="themeService.isDark() ? 'Passer en mode clair' : 'Passer en mode sombre'"
            [attr.aria-label]="themeService.isDark() ? 'Passer en mode clair' : 'Passer en mode sombre'">
            <mat-icon>{{ themeService.isDark() ? 'light_mode' : 'dark_mode' }}</mat-icon>
          </button>

          <div class="user-controls" *ngIf="authService.isLoggedIn()">
            <span class="welcome-text">
              <mat-icon class="user-icon">account_circle</mat-icon>
              {{ authService.getUsername() }}
            </span>
            <button mat-stroked-button class="logout-btn" (click)="onLogout()">
              <mat-icon>power_settings_new</mat-icon>
              Déconnexion
            </button>
          </div>
        </div>
      </div>
    </mat-toolbar>
  `,
  styles: [`
    .glass-header {
      background: var(--header-bg) !important;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border-glass);
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 70px;
      color: var(--text-primary);
      padding: 0;
      transition: background 0.25s ease, border-color 0.25s ease, color 0.25s ease;
    }
    .header-container {
      width: 90%;
      max-width: 1400px;
      margin: 0 auto;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .logo-area {
      display: flex;
      align-items: center;
      cursor: pointer;
      gap: 10px;
      transition: opacity 0.2s;
    }
    .logo-area:hover {
      opacity: 0.85;
    }
    .logo-icon {
      color: var(--accent-cyan);
      font-size: 32px;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .logo-text {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      font-size: 22px;
      letter-spacing: 0.5px;
      color: var(--text-primary);
    }
    .logo-ai {
      color: var(--accent-cyan);
      background: var(--accent-cyan-glow);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 14px;
      vertical-align: middle;
      margin-left: 5px;
      border: 1px solid var(--accent-cyan-glow);
    }
    .spacer {
      flex: 1 1 auto;
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .theme-toggle {
      color: var(--text-secondary) !important;
      border: 1px solid var(--border-glass);
      border-radius: 10px !important;
      width: 40px !important;
      height: 40px !important;
      transition: all 0.2s ease !important;
    }
    .theme-toggle:hover {
      color: var(--accent-cyan) !important;
      background: var(--accent-cyan-glow) !important;
      border-color: var(--accent-cyan-glow);
    }
    .user-controls {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .welcome-text {
      color: var(--text-secondary);
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    .user-icon {
      color: var(--accent-cyan);
    }
    .logout-btn {
      color: var(--accent-danger) !important;
      border-color: color-mix(in srgb, var(--accent-danger) 30%, transparent) !important;
      transition: all 0.3s !important;
      font-weight: 500 !important;
    }
    .logout-btn:hover {
      background: color-mix(in srgb, var(--accent-danger) 10%, transparent) !important;
      border-color: var(--accent-danger) !important;
    }
  `]
})
export class NavBarComponent {
  authService = inject(AuthService);
  vehicleService = inject(VehicleService);
  themeService = inject(ThemeService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.vehicleService.selectVehicle(null);
    this.router.navigate(['/login']);
  }
}
