import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { AuthService } from '../../services/auth.service';

@Component({

  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="auth-wrapper">
      <div class="background-decor">
        <div class="blur-circle circle-1"></div>
        <div class="blur-circle circle-2"></div>
      </div>
      
      <mat-card class="auth-card glass-panel">
        <div class="auth-header">
          <div class="auth-icon-badge">
            <mat-icon>build_circle</mat-icon>
          </div>
          <h1>AutoMechanic <span class="accent-text">AI</span></h1>
          <p class="subtitle">{{ isLoginMode ? 'Connectez-vous pour diagnostiquer vos pannes' : 'Créez votre compte de diagnostic intelligent' }}</p>
        </div>
        
        <mat-card-content>
          <div *ngIf="errorMsg" class="alert-box error-alert">
            <mat-icon class="alert-icon">error_outline</mat-icon>
            <span>{{ errorMsg }}</span>
          </div>

          <div *ngIf="successMsg" class="alert-box success-alert">
            <mat-icon class="alert-icon">check_circle_outline</mat-icon>
            <span>{{ successMsg }}</span>
          </div>

          <form [formGroup]="authForm" (ngSubmit)="onSubmit()" class="form-container">
            <!-- Username -->
            <mat-form-field appearance="outline" class="full-width dark-field">
              <mat-label>Nom d'utilisateur</mat-label>
              <input matInput formControlName="username" placeholder="Entrez votre pseudo" autocomplete="username">
              <mat-icon matPrefix>person</mat-icon>
              <mat-error *ngIf="authForm.get('username')?.hasError('required')">
                Le nom d'utilisateur est requis
              </mat-error>
            </mat-form-field>

            <!-- Email (Only for registration) -->
            <mat-form-field appearance="outline" class="full-width dark-field" *ngIf="!isLoginMode">
              <mat-label>Adresse e-mail</mat-label>
              <input matInput type="email" formControlName="email" placeholder="exemple@mail.com" autocomplete="email">
              <mat-icon matPrefix>email</mat-icon>
              <mat-error *ngIf="authForm.get('email')?.hasError('required')">
                L'adresse e-mail est requise
              </mat-error>
              <mat-error *ngIf="authForm.get('email')?.hasError('email')">
                Format de courriel invalide
              </mat-error>
            </mat-form-field>

            <!-- Password -->
            <mat-form-field appearance="outline" class="full-width dark-field">
              <mat-label>Mot de passe</mat-label>
              <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" placeholder="••••••••" autocomplete="current-password">
              <mat-icon matPrefix>lock</mat-icon>
              <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
                <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
              </button>
              <mat-error *ngIf="authForm.get('password')?.hasError('required')">
                Le mot de passe est requis
              </mat-error>
              <mat-error *ngIf="authForm.get('password')?.hasError('minlength')">
                Le mot de passe doit comporter au moins 6 caractères
              </mat-error>
            </mat-form-field>

            <button mat-raised-button color="primary" type="submit" class="submit-btn" [disabled]="isLoading || authForm.invalid">
              <mat-spinner diameter="20" *ngIf="isLoading" class="spinner"></mat-spinner>
              <span *ngIf="!isLoading">{{ isLoginMode ? 'Se Connecter' : "S'inscrire" }}</span>
            </button>
          </form>

          <div class="toggle-mode">
            <span class="muted-text">{{ isLoginMode ? "Vous n'avez pas de compte ?" : "Vous avez déjà un compte ?" }}</span>
            <button mat-button class="toggle-btn" (click)="toggleMode()" type="button" [disabled]="isLoading">
              {{ isLoginMode ? "Créer un compte" : "Se connecter" }}
            </button>
          </div>

          <div class="guest-credentials" *ngIf="isLoginMode">
            <div class="credentials-badge">
              <mat-icon class="badge-icon">info</mat-icon>
              <span>Démo : <strong>user</strong> / <strong>user123</strong></span>
            </div>
          </div>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: calc(100vh - 70px);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      background-color: var(--bg-primary);
      overflow: hidden;
      padding: 20px;
    }
    .background-decor {
      position: absolute;
      width: 100%;
      height: 100%;
      top: 0;
      left: 0;
      pointer-events: none;
      z-index: 0;
    }
    .blur-circle {
      position: absolute;
      border-radius: 50%;
      filter: blur(80px);
      opacity: 0.15;
    }
    .circle-1 {
      width: 400px;
      height: 400px;
      background: #00d2ff;
      top: -100px;
      right: -100px;
    }
    .circle-2 {
      width: 500px;
      height: 500px;
      background: #ff3b30;
      bottom: -150px;
      left: -150px;
    }
    .auth-card {
      width: 100%;
      max-width: 450px;
      padding: 30px 20px;
      z-index: 10;
      border-radius: 16px !important;
    }
    .glass-panel {
      background: var(--bg-elevated) !important;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid var(--border-glass);
      box-shadow: var(--shadow-panel);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 30px;
    }
    .auth-icon-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 14px;
      background: rgba(0, 210, 255, 0.08);
      border: 1px solid rgba(0, 210, 255, 0.2);
      margin-bottom: 15px;
    }
    .auth-icon-badge mat-icon {
      color: var(--accent-cyan);
      font-size: 36px;
      width: 36px;
      height: 36px;
    }
    .auth-header h1 {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      color: var(--text-primary);
      font-size: 26px;
      margin: 0;
    }
    .accent-text {
      color: var(--accent-cyan);
    }
    .subtitle {
      font-size: 13px;
      color: var(--text-secondary);
      margin: 8px 0 0 0;
      font-weight: 400;
    }
    .form-container {
      display: flex;
      flex-direction: column;
      gap: 15px;
    }
    .full-width {
      width: 100%;
    }
    .submit-btn {
      height: 50px !important;
      background: linear-gradient(135deg, #00b4db, #00d2ff) !important;
      color: var(--cta-text) !important;
      font-weight: 700 !important;
      font-size: 15px !important;
      border-radius: 8px !important;
      margin-top: 10px;
      letter-spacing: 0.5px;
      display: flex;
      justify-content: center;
      align-items: center;
      box-shadow: 0 4px 15px rgba(0, 210, 255, 0.2);
      transition: all 0.3s;
    }
    .submit-btn:hover:not(:disabled) {
      box-shadow: 0 6px 20px rgba(0, 210, 255, 0.35);
      transform: translateY(-1px);
    }
    .submit-btn:disabled {
      background: var(--bg-disabled) !important;
      color: var(--text-disabled) !important;
      box-shadow: none;
    }
    .toggle-mode {
      text-align: center;
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 13px;
      gap: 5px;
    }
    .muted-text {
      color: var(--text-muted);
    }
    .toggle-btn {
      color: var(--accent-cyan) !important;
      font-weight: 600 !important;
      padding: 0 5px !important;
      min-width: unset !important;
    }
    .spinner {
      margin: 0 auto;
    }
    .alert-box {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 12px;
      border-radius: 8px;
      font-size: 13px;
      margin-bottom: 20px;
      border: 1px solid;
    }
    .error-alert {
      background: rgba(255, 59, 48, 0.08);
      color: #ff453a;
      border-color: rgba(255, 59, 48, 0.15);
    }
    .success-alert {
      background: rgba(52, 199, 89, 0.08);
      color: #30d158;
      border-color: rgba(52, 199, 89, 0.15);
    }
    .alert-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .guest-credentials {
      margin-top: 25px;
      display: flex;
      justify-content: center;
    }
    .credentials-badge {
      display: flex;
      align-items: center;
      gap: 8px;
      background: var(--bg-muted);
      padding: 6px 14px;
      border-radius: 30px;
      border: 1px solid var(--border-subtle);
      font-size: 12px;
      color: var(--text-secondary);
    }
    .badge-icon {
      color: var(--accent-cyan);
      font-size: 15px;
      width: 15px;
      height: 15px;
    }
  `]
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoginMode = true;
  isLoading = false;
  hidePassword = true;
  errorMsg = '';
  successMsg = '';

  authForm: FormGroup = this.fb.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });

  toggleMode(): void {
    this.isLoginMode = !this.isLoginMode;
    this.errorMsg = '';
    this.successMsg = '';
    
    if (this.isLoginMode) {
      this.authForm = this.fb.group({
        username: ['', [Validators.required]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    } else {
      this.authForm = this.fb.group({
        username: ['', [Validators.required]],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]]
      });
    }
  }

  onSubmit(): void {
    if (this.authForm.invalid) return;

    this.isLoading = true;
    this.errorMsg = '';
    this.successMsg = '';

    if (this.isLoginMode) {
      this.authService.login(this.authForm.value).subscribe({
        next: () => {
          this.isLoading = false;
          this.router.navigate(['/select']);
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMsg = err.error?.error || "Une erreur est survenue lors de la connexion.";
        }
      });
    } else {
      this.authService.register(this.authForm.value).subscribe({
        next: (res) => {
          this.isLoading = false;
          this.successMsg = res.message || "Inscription réussie ! Connectez-vous maintenant.";
          this.isLoginMode = true;
          this.authForm = this.fb.group({
            username: [this.authForm.value.username, [Validators.required]],
            password: ['', [Validators.required, Validators.minLength(6)]]
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.errorMsg = err.error?.error || "Une erreur est survenue lors de l'inscription.";
        }
      });
    }
  }
}
