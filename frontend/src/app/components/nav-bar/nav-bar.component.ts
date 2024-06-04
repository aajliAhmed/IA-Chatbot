import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../services/auth.service';
import { VehicleService } from '../../services/vehicle.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, MatToolbarModule, MatButtonModule, MatIconModule],
  template: `
    <mat-toolbar class="glass-header">
      <div class="header-container">
        <div class="logo-area" routerLink="/select">
          <mat-icon class="logo-icon">build_circle</mat-icon>
          <span class="logo-text">AutoMechanic <span class="logo-ai">AI</span></span>
        </div>
        
        <span class="spacer"></span>
        
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
    </mat-toolbar>
  `,
  styles: [`
    .glass-header {
      background: rgba(26, 26, 30, 0.75) !important;
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      position: sticky;
      top: 0;
      z-index: 1000;
      height: 70px;
      color: #ffffff;
      padding: 0;
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
      color: #00d2ff;
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
    }
    .logo-ai {
      color: #00d2ff;
      background: rgba(0, 210, 255, 0.1);
      padding: 2px 8px;
      border-radius: 4px;
      font-size: 14px;
      vertical-align: middle;
      margin-left: 5px;
      border: 1px solid rgba(0, 210, 255, 0.25);
    }
    .spacer {
      flex: 1 1 auto;
    }
    .user-controls {
      display: flex;
      align-items: center;
      gap: 20px;
    }
    .welcome-text {
      color: #b0b0b8;
      font-size: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 500;
    }
    .user-icon {
      color: #00d2ff;
    }
    .logout-btn {
      color: #ff3b30 !important;
      border-color: rgba(255, 59, 48, 0.3) !important;
      transition: all 0.3s !important;
      font-weight: 500 !important;
    }
    .logout-btn:hover {
      background: rgba(255, 59, 48, 0.08) !important;
      border-color: #ff3b30 !important;
      box-shadow: 0 0 10px rgba(255, 59, 48, 0.15);
    }
  `]
})
export class NavBarComponent {
  authService = inject(AuthService);
  vehicleService = inject(VehicleService);
  private router = inject(Router);

  onLogout(): void {
    this.authService.logout();
    this.vehicleService.selectVehicle(null);
    this.router.navigate(['/login']);
  }
}
