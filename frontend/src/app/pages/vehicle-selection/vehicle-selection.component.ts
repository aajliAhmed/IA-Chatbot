import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { VehicleService } from '../../services/vehicle.service';
import { Brand, CarModel } from '../../models/vehicle.model';

@Component({
  selector: 'app-vehicle-selection',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="selection-wrapper">
      <div class="background-glow"></div>
      
      <mat-card class="selection-card glass-panel animate-fade-in">
        <div class="selection-header">
          <div class="vehicle-badge">
            <mat-icon>directions_car</mat-icon>
          </div>
          <h1>Choisissez votre véhicule</h1>
          <p class="subtitle">Sélectionnez la marque, le modèle et l'année pour charger les spécifications techniques et démarrer le diagnostic IA.</p>
        </div>

        <mat-card-content>
          <form [formGroup]="vehicleForm" (ngSubmit)="onSubmit()" class="selection-form">
            
            <!-- Marque -->
            <mat-form-field appearance="outline" class="full-width dark-field">
              <mat-label>Marque du véhicule</mat-label>
              <mat-select formControlName="brandId" (selectionChange)="onBrandChange($event.value)" placeholder="Sélectionnez la marque">
                <mat-option *ngFor="let brand of brands" [value]="brand.id">
                  {{ brand.name }}
                </mat-option>
              </mat-select>
              <mat-icon matPrefix class="form-prefix-icon">branding_watermark</mat-icon>
              <mat-error *ngIf="vehicleForm.get('brandId')?.hasError('required')">
                Veuillez choisir une marque
              </mat-error>
            </mat-form-field>

            <!-- Modèle -->
            <mat-form-field appearance="outline" class="full-width dark-field">
              <mat-label>Modèle du véhicule</mat-label>
              <mat-select formControlName="modelId" [disabled]="!selectedBrandId || isLoadingModels" placeholder="Sélectionnez le modèle">
                <mat-option *ngFor="let model of models" [value]="model.id">
                  {{ model.name }}
                </mat-option>
              </mat-select>
              <mat-icon matPrefix class="form-prefix-icon">model_training</mat-icon>
              <mat-spinner matSuffix diameter="18" *ngIf="isLoadingModels" class="field-spinner"></mat-spinner>
              <mat-error *ngIf="vehicleForm.get('modelId')?.hasError('required')">
                Veuillez choisir un modèle
              </mat-error>
            </mat-form-field>

            <!-- Année -->
            <mat-form-field appearance="outline" class="full-width dark-field">
              <mat-label>Année de fabrication</mat-label>
              <input matInput type="number" formControlName="year" placeholder="Ex: 2020" min="1980" max="2026">
              <mat-icon matPrefix class="form-prefix-icon">calendar_today</mat-icon>
              <mat-error *ngIf="vehicleForm.get('year')?.hasError('required')">
                L'année est requise
              </mat-error>
              <mat-error *ngIf="vehicleForm.get('year')?.hasError('min') || vehicleForm.get('year')?.hasError('max')">
                L'année doit être comprise entre 1980 et 2026
              </mat-error>
            </mat-form-field>

            <button mat-raised-button class="diagnostic-btn" type="submit" [disabled]="vehicleForm.invalid || isSubmitting">
              <mat-spinner diameter="20" *ngIf="isSubmitting" class="spinner"></mat-spinner>
              <span *ngIf="!isSubmitting">Accéder au diagnostic</span>
              <mat-icon *ngIf="!isSubmitting" class="btn-icon">arrow_forward</mat-icon>
            </button>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .selection-wrapper {
      min-height: calc(100vh - 70px);
      display: flex;
      justify-content: center;
      align-items: center;
      position: relative;
      background-color: #121214;
      overflow: hidden;
      padding: 20px;
    }
    .background-glow {
      position: absolute;
      width: 600px;
      height: 600px;
      background: radial-gradient(circle, rgba(0, 210, 255, 0.08) 0%, rgba(0, 0, 0, 0) 70%);
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      pointer-events: none;
      z-index: 0;
    }
    .selection-card {
      width: 100%;
      max-width: 500px;
      padding: 40px 30px;
      z-index: 10;
      border-radius: 16px !important;
    }
    .glass-panel {
      background: rgba(26, 26, 30, 0.65) !important;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.5);
    }
    .selection-header {
      text-align: center;
      margin-bottom: 35px;
    }
    .vehicle-badge {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: rgba(0, 210, 255, 0.08);
      border: 1px solid rgba(0, 210, 255, 0.2);
      margin-bottom: 15px;
    }
    .vehicle-badge mat-icon {
      color: #00d2ff;
      font-size: 32px;
      width: 32px;
      height: 32px;
    }
    .selection-header h1 {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      color: #ffffff;
      font-size: 26px;
      margin: 0;
      letter-spacing: -0.5px;
    }
    .subtitle {
      font-size: 13px;
      color: #b0b0b8;
      margin: 10px 0 0 0;
      line-height: 1.6;
    }
    .selection-form {
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .full-width {
      width: 100%;
    }
    .form-prefix-icon {
      color: #8c8c96;
      margin-right: 8px;
    }
    .field-spinner {
      margin-right: 8px;
    }
    .diagnostic-btn {
      height: 52px !important;
      background: linear-gradient(135deg, #00b4db, #00d2ff) !important;
      color: #000000 !important;
      font-weight: 700 !important;
      font-size: 15px !important;
      border-radius: 8px !important;
      margin-top: 15px;
      letter-spacing: 0.5px;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 8px;
      box-shadow: 0 4px 15px rgba(0, 210, 255, 0.2);
      transition: all 0.3s !important;
    }
    .diagnostic-btn:hover:not(:disabled) {
      box-shadow: 0 6px 22px rgba(0, 210, 255, 0.4);
      transform: translateY(-2px);
    }
    .diagnostic-btn:disabled {
      background: rgba(255, 255, 255, 0.08) !important;
      color: rgba(255, 255, 255, 0.3) !important;
      box-shadow: none;
    }
    .btn-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      vertical-align: middle;
    }
    .spinner {
      margin: 0 auto;
    }
    .animate-fade-in {
      animation: fadeIn 0.6s ease-out;
    }
    @keyframes fadeIn {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `]
})
export class VehicleSelectionComponent implements OnInit {
  private fb = inject(FormBuilder);
  private vehicleService = inject(VehicleService);
  private router = inject(Router);

  brands: Brand[] = [];
  models: CarModel[] = [];
  selectedBrandId: number | null = null;
  isLoadingModels = false;
  isSubmitting = false;

  currentYear = new Date().getFullYear();
  vehicleForm: FormGroup = this.fb.group({
    brandId: ['', [Validators.required]],
    modelId: [{ value: '', disabled: true }, [Validators.required]],
    year: ['', [Validators.required, Validators.min(1980), Validators.max(this.currentYear + 1)]]
  });

  ngOnInit(): void {
    // 1. Fetch available brands from backend
    this.vehicleService.getBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (err) => {
        console.error("Error loading brands", err);
      }
    });

    // 2. If a vehicle is already active, pre-populate form for seamless reload!
    const active = this.vehicleService.getSelectedVehicle();
    if (active) {
      // Find Brand ID by name matching
      this.vehicleService.getBrands().subscribe(brands => {
        const matchingBrand = brands.find(b => b.name === active.brandName);
        if (matchingBrand) {
          this.selectedBrandId = matchingBrand.id;
          this.vehicleForm.patchValue({ brandId: matchingBrand.id });
          this.onBrandChange(matchingBrand.id, active.carModelId);
          this.vehicleForm.patchValue({ year: this.currentYear });
        }
      });
    }
  }

  onBrandChange(brandId: number, autoSelectModelId?: number): void {
    this.selectedBrandId = brandId;
    this.models = [];
    this.vehicleForm.get('modelId')?.setValue('');
    this.vehicleForm.get('modelId')?.disable();
    this.isLoadingModels = true;

    // Load models for this brand
    this.vehicleService.getModels(brandId).subscribe({
      next: (data) => {
        this.models = data;
        this.isLoadingModels = false;
        this.vehicleForm.get('modelId')?.enable();
        if (autoSelectModelId) {
          this.vehicleForm.patchValue({ modelId: autoSelectModelId });
        }
      },
      error: (err) => {
        this.isLoadingModels = false;
        console.error("Error loading models", err);
      }
    });
  }

  onSubmit(): void {
    if (this.vehicleForm.invalid) return;

    this.isSubmitting = true;
    const { modelId, year } = this.vehicleForm.value;

    this.vehicleService.getMechanicalInfo(modelId).subscribe({
      next: (info) => {
        this.isSubmitting = false;
        // Save the manufacture year globally into selected vehicle metadata!
        const vehicleWithYear = { ...info, year: year };
        this.vehicleService.selectVehicle(vehicleWithYear);
        this.router.navigate(['/chat']);
      },
      error: (err) => {
        this.isSubmitting = false;
        console.error("Error retrieving vehicle mechanical data", err);
      }
    });
  }
}
