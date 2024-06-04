import { Component, OnInit, OnDestroy, ViewChild, ElementRef, AfterViewChecked, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { Subscription } from 'rxjs';
import { VehicleService } from '../../services/vehicle.service';
import { ChatService } from '../../services/chat.service';
import { VehicleMechanicalInfo } from '../../models/vehicle.model';
import { ChatMessage } from '../../models/chat.model';

@Component({
  selector: 'app-chat-assistant',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatIconModule,
    MatChipsModule,
    MatProgressBarModule
  ],
  template: `
    <div class="chat-wrapper" *ngIf="vehicle">
      
      <!-- Top Vehicle Banner -->
      <div class="vehicle-banner">
        <div class="banner-content">
          <button mat-icon-button class="back-btn" routerLink="/select" title="Changer de véhicule">
            <mat-icon>arrow_back</mat-icon>
          </button>
          
          <div class="banner-title-area">
            <span class="banner-meta">Diagnostic actif</span>
            <h2>{{ vehicle.brandName }} {{ vehicle.modelName }} <span class="year-badge">{{ vehicleYear }}</span></h2>
          </div>
          
          <div class="engine-pills">
            <span class="pill-badge fuel-pill">
              <mat-icon>local_gas_station</mat-icon>
              {{ vehicle.fuelType }}
            </span>
            <span class="pill-badge power-pill">
              <mat-icon>speed</mat-icon>
              {{ vehicle.horsepower }}
            </span>
            <span class="pill-badge transmission-pill">
              <mat-icon>settings_input_hdmi</mat-icon>
              {{ vehicle.transmission }}
            </span>
          </div>
        </div>
      </div>

      <!-- Main Layout Grid -->
      <div class="dashboard-grid">
        
        <!-- Left Column: Specs HUD -->
        <div class="specs-hud-column">
          <mat-card class="hud-card glass-panel animate-slide-right">
            <mat-card-header class="hud-header">
              <mat-icon class="header-icon">analytics</mat-icon>
              <mat-card-title>Fiche Technique AI</mat-card-title>
              <mat-card-subtitle>Paramètres mécaniques recommandés</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content class="hud-body">
              
              <!-- Core specs items -->
              <div class="specs-list">
                <div class="spec-item">
                  <div class="spec-icon-box">
                    <mat-icon>opacity</mat-icon>
                  </div>
                  <div class="spec-details">
                    <span class="spec-label">Huile Moteur</span>
                    <span class="spec-value">{{ vehicle.oilType }} ({{ vehicle.oilCapacity }})</span>
                  </div>
                </div>

                <div class="spec-item">
                  <div class="spec-icon-box">
                    <mat-icon>battery_charging_full</mat-icon>
                  </div>
                  <div class="spec-details">
                    <span class="spec-label">Batterie Recommandée</span>
                    <span class="spec-value">{{ vehicle.recommendedBattery }}</span>
                  </div>
                </div>

                <div class="spec-item">
                  <div class="spec-icon-box">
                    <mat-icon>tire_repair</mat-icon>
                  </div>
                  <div class="spec-details">
                    <span class="spec-label">Pression des Pneus</span>
                    <span class="spec-value">{{ vehicle.tirePressure }}</span>
                  </div>
                </div>

                <div class="spec-item">
                  <div class="spec-icon-box">
                    <mat-icon>eco</mat-icon>
                  </div>
                  <div class="spec-details">
                    <span class="spec-label">Consommation & Fréquence</span>
                    <span class="spec-value">{{ vehicle.averageConsumption }} | {{ vehicle.maintenanceFrequency }}</span>
                  </div>
                </div>
              </div>

              <!-- Critical warning details -->
              <div class="hud-divider"></div>
              
              <div class="warning-section">
                <div class="warning-title">
                  <mat-icon class="warn-icon-alert">warning</mat-icon>
                  <span>Problèmes connus fréquents</span>
                </div>
                <p class="warning-text">{{ vehicle.commonProblems }}</p>
              </div>

              <div class="warning-section">
                <div class="warning-title">
                  <mat-icon class="warn-icon-parts">report</mat-icon>
                  <span>Pièces d'usure sensibles</span>
                </div>
                <div class="parts-chips-container">
                  <span class="part-chip" *ngFor="let part of sensitivePartsList">{{ part }}</span>
                </div>
              </div>

            </mat-card-content>
          </mat-card>
        </div>
        
        <!-- Right Column: Chat Console -->
        <div class="chat-column">
          <mat-card class="chat-card glass-panel animate-slide-left">
            <mat-card-header class="chat-header">
              <mat-icon class="header-icon chat-bot-icon">psychology</mat-icon>
              <mat-card-title>Assistant Mécanicien Virtuel</mat-card-title>
              <mat-card-subtitle>Posez vos questions de pannes, bruits suspectés ou entretiens</mat-card-subtitle>
            </mat-card-header>
            
            <mat-card-content class="chat-log-wrapper">
              <div class="chat-log" #chatScrollContainer>
                
                <!-- Welcome Prompt -->
                <div class="welcome-message-bubble">
                  <mat-icon class="bubble-icon">spatial_audio</mat-icon>
                  <p>Bonjour ! Je suis votre assistant **AutoMechanic AI**. J'ai chargé les spécifications de votre **{{ vehicle.brandName }} {{ vehicle.modelName }}**.</p>
                  <p class="suggestions-caption">Vous pouvez me demander par exemple :</p>
                  <div class="quick-prompts">
                    <button class="prompt-chip" (click)="applyQuickPrompt('Ma voiture fait un bruit métallique au freinage')">
                      "Bruit métallique au freinage"
                    </button>
                    <button class="prompt-chip" (click)="applyQuickPrompt('Quelle huile utiliser pour la vidange ?')">
                      "Quelle huile pour vidange ?"
                    </button>
                    <button class="prompt-chip" (click)="applyQuickPrompt('Mon moteur broute à bas régime')">
                      "Moteur broute à bas régime"
                    </button>
                  </div>
                </div>

                <!-- Messages loop -->
                <div *ngFor="let msg of messages" [ngClass]="['msg-row', msg.sender === 'user' ? 'user-row' : 'ai-row']">
                  <div class="avatar-badge">
                    <mat-icon>{{ msg.sender === 'user' ? 'person' : 'smart_toy' }}</mat-icon>
                  </div>
                  
                  <div class="bubble">
                    <div class="bubble-text">{{ msg.text }}</div>
                    
                    <!-- AI Diagnostic Block if available -->
                    <div *ngIf="msg.diagnosticDetails && msg.diagnosticDetails.probableDiagnostic !== 'Hors sujet' && msg.diagnosticDetails.urgencyLevel !== 'AUCUN'" class="diagnostic-panel">
                      <div class="diag-banner">
                        <mat-icon class="diag-header-icon">troubleshoot</mat-icon>
                        <span class="diag-title">Rapport de Diagnostic Prédictif</span>
                      </div>
                      
                      <div class="diag-grid">
                        <div class="diag-cell">
                          <span class="cell-label">Diagnostic Probable</span>
                          <span class="cell-val">{{ msg.diagnosticDetails.probableDiagnostic }}</span>
                        </div>
                        <div class="diag-cell">
                          <span class="cell-label">Niveau d'Urgence</span>
                          <span [ngClass]="['urgency-chip', 'urgency-' + msg.diagnosticDetails.urgencyLevel.toLowerCase()]">
                            {{ msg.diagnosticDetails.urgencyLevel }}
                          </span>
                        </div>
                        <div class="diag-cell full-width-cell">
                          <span class="cell-label">Cause Réelle Possible</span>
                          <span class="cell-val">{{ msg.diagnosticDetails.possibleCause }}</span>
                        </div>
                        <div class="diag-cell full-width-cell">
                          <span class="cell-label">Conseils de vérification</span>
                          <span class="cell-val">{{ msg.diagnosticDetails.checkAdvice }}</span>
                        </div>
                        <div class="diag-cell full-width-cell">
                          <span class="cell-label font-danger">Composants suspectés</span>
                          <span class="cell-val parts-val">{{ msg.diagnosticDetails.concernedParts }}</span>
                        </div>
                        <div class="diag-cell full-width-cell font-success-box">
                          <span class="cell-label font-success">Action / Recommandation d'entretien</span>
                          <span class="cell-val">{{ msg.diagnosticDetails.maintenanceRecommendation }}</span>
                        </div>
                      </div>
                    </div>

                    <!-- Muted fallback alert for off-topics -->
                    <div *ngIf="msg.diagnosticDetails && msg.diagnosticDetails.probableDiagnostic === 'Hors sujet'" class="off-topic-alert">
                      <mat-icon class="off-icon">info_outline</mat-icon>
                      <span>Veuillez vous concentrer sur des requêtes liées à l'automobile (freins, moteur, batterie, etc.).</span>
                    </div>

                    <span class="time-stamp">{{ msg.timestamp | date:'HH:mm' }}</span>
                  </div>
                </div>

                <!-- Typing Loader indicator -->
                <div *ngIf="isWaitingForAi" class="msg-row ai-row typing-row">
                  <div class="avatar-badge">
                    <mat-icon>smart_toy</mat-icon>
                  </div>
                  <div class="bubble typing-bubble">
                    <div class="typing-indicator">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </div>

              </div>
            </mat-card-content>
            
            <!-- Chat Input form -->
            <div class="hud-divider"></div>
            
            <div class="input-container">
              <input type="text" [(ngModel)]="userInput" (keydown.enter)="onSend()" placeholder="Décrivez votre symptôme ou question..." [disabled]="isWaitingForAi" class="message-input">
              <button mat-fab class="send-btn" (click)="onSend()" [disabled]="!userInput.trim() || isWaitingForAi" title="Envoyer le message">
                <mat-icon>send</mat-icon>
              </button>
            </div>
          </mat-card>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .chat-wrapper {
      min-height: calc(100vh - 70px);
      background-color: #121214;
      padding: 30px 40px;
      display: flex;
      flex-direction: column;
      gap: 30px;
      box-sizing: border-box;
      max-width: 1500px;
      margin: 0 auto;
    }
    .vehicle-banner {
      background: linear-gradient(135deg, rgba(26, 26, 30, 0.8) 0%, rgba(18, 18, 20, 0.9) 100%);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 12px;
      padding: 18px 25px;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    }
    .banner-content {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      gap: 20px;
    }
    .back-btn {
      color: #b0b0b8 !important;
      background: rgba(255, 255, 255, 0.04) !important;
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px !important;
    }
    .back-btn:hover {
      color: #00d2ff !important;
      background: rgba(0, 210, 255, 0.08) !important;
    }
    .banner-title-area {
      display: flex;
      flex-direction: column;
    }
    .banner-meta {
      font-size: 11px;
      color: #00d2ff;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 1px;
      margin-bottom: 2px;
    }
    .banner-title-area h2 {
      font-family: 'Outfit', sans-serif;
      font-weight: 700;
      color: #ffffff;
      margin: 0;
      font-size: 22px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .year-badge {
      background: rgba(255, 255, 255, 0.08);
      padding: 2px 10px;
      border-radius: 30px;
      font-size: 14px;
      color: #b0b0b8;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .engine-pills {
      margin-left: auto;
      display: flex;
      gap: 12px;
      align-items: center;
    }
    .pill-badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 14px;
      border-radius: 6px;
      font-size: 13px;
      font-weight: 600;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .fuel-pill {
      background: rgba(0, 210, 255, 0.08);
      color: #00d2ff;
      border-color: rgba(0, 210, 255, 0.15);
    }
    .power-pill {
      background: rgba(255, 149, 0, 0.08);
      color: #ff9500;
      border-color: rgba(255, 149, 0, 0.15);
    }
    .transmission-pill {
      background: rgba(52, 199, 89, 0.08);
      color: #30d158;
      border-color: rgba(52, 199, 89, 0.15);
    }
    .pill-badge mat-icon {
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .dashboard-grid {
      display: grid;
      grid-template-columns: 38% 62%;
      gap: 30px;
      align-items: stretch;
      flex: 1;
    }
    .hud-card, .chat-card {
      height: 100%;
      border-radius: 16px !important;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .glass-panel {
      background: rgba(26, 26, 30, 0.65) !important;
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      box-shadow: 0 15px 35px rgba(0, 0, 0, 0.4);
    }
    .hud-header, .chat-header {
      padding: 20px 25px !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.06);
    }
    .header-icon {
      color: #00d2ff;
      font-size: 26px;
      width: 26px;
      height: 26px;
      margin-right: 12px;
    }
    .hud-card mat-card-title, .chat-card mat-card-title {
      color: #ffffff !important;
      font-family: 'Outfit', sans-serif;
      font-weight: 700 !important;
      font-size: 18px !important;
      letter-spacing: -0.3px;
    }
    .hud-card mat-card-subtitle, .chat-card mat-card-subtitle {
      color: #8c8c96 !important;
      font-size: 12px !important;
      margin-top: 2px !important;
    }
    .hud-body {
      padding: 25px !important;
      display: flex;
      flex-direction: column;
      gap: 25px;
      overflow-y: auto;
      flex: 1;
    }
    .specs-list {
      display: flex;
      flex-direction: column;
      gap: 18px;
    }
    .spec-item {
      display: flex;
      align-items: center;
      gap: 15px;
      background: rgba(255, 255, 255, 0.02);
      padding: 12px 16px;
      border-radius: 8px;
      border: 1px solid rgba(255, 255, 255, 0.04);
      transition: background 0.2s;
    }
    .spec-item:hover {
      background: rgba(255, 255, 255, 0.04);
    }
    .spec-icon-box {
      width: 38px;
      height: 38px;
      border-radius: 8px;
      background: rgba(0, 210, 255, 0.08);
      border: 1px solid rgba(0, 210, 255, 0.15);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .spec-icon-box mat-icon {
      color: #00d2ff;
      font-size: 20px;
      width: 20px;
      height: 20px;
    }
    .spec-details {
      display: flex;
      flex-direction: column;
    }
    .spec-label {
      font-size: 11px;
      color: #8c8c96;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      font-weight: 600;
    }
    .spec-value {
      font-size: 14px;
      color: #ffffff;
      font-weight: 700;
      margin-top: 2px;
    }
    .hud-divider {
      height: 1px;
      background: rgba(255, 255, 255, 0.06);
      width: 100%;
    }
    .warning-section {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .warning-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-weight: 700;
      font-size: 13px;
      color: #ffffff;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .warn-icon-alert {
      color: #ff9500;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .warn-icon-parts {
      color: #00d2ff;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .warning-text {
      font-size: 13px;
      color: #b0b0b8;
      line-height: 1.6;
      margin: 0;
    }
    .parts-chips-container {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
      margin-top: 5px;
    }
    .part-chip {
      background: rgba(255, 255, 255, 0.04);
      color: #b0b0b8;
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 4px 10px;
      border-radius: 4px;
      font-size: 11px;
      font-weight: 600;
    }
    .chat-log-wrapper {
      flex: 1;
      padding: 0 !important;
      overflow: hidden;
      position: relative;
    }
    .chat-log {
      width: 100%;
      height: 480px;
      overflow-y: auto;
      padding: 25px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }
    .welcome-message-bubble {
      background: rgba(0, 210, 255, 0.04);
      border: 1px solid rgba(0, 210, 255, 0.1);
      border-radius: 12px;
      padding: 20px;
      color: #b0b0b8;
      font-size: 13px;
      line-height: 1.6;
      margin-bottom: 5px;
    }
    .bubble-icon {
      color: #00d2ff;
      font-size: 24px;
      width: 24px;
      height: 24px;
      margin-bottom: 10px;
    }
    .welcome-message-bubble p {
      margin: 0 0 10px 0;
    }
    .welcome-message-bubble p:last-child {
      margin-bottom: 0;
    }
    .suggestions-caption {
      font-weight: 700;
      color: #ffffff;
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-top: 15px !important;
    }
    .quick-prompts {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 10px;
    }
    .prompt-chip {
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.05);
      border-radius: 6px;
      padding: 8px 12px;
      color: #00d2ff;
      font-size: 12px;
      text-align: left;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }
    .prompt-chip:hover {
      background: rgba(0, 210, 255, 0.08);
      border-color: rgba(0, 210, 255, 0.25);
    }
    .msg-row {
      display: flex;
      gap: 15px;
      max-width: 85%;
      align-items: flex-start;
    }
    .user-row {
      align-self: flex-end;
      flex-direction: row-reverse;
    }
    .ai-row {
      align-self: flex-start;
    }
    .avatar-badge {
      width: 36px;
      height: 36px;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.06);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .ai-row .avatar-badge {
      background: rgba(0, 210, 255, 0.08);
      border-color: rgba(0, 210, 255, 0.15);
    }
    .avatar-badge mat-icon {
      font-size: 18px;
      width: 18px;
      height: 18px;
      color: #b0b0b8;
    }
    .ai-row .avatar-badge mat-icon {
      color: #00d2ff;
    }
    .bubble {
      padding: 15px 18px;
      border-radius: 12px;
      font-size: 14px;
      line-height: 1.6;
      position: relative;
      display: flex;
      flex-direction: column;
      gap: 10px;
    }
    .user-row .bubble {
      background: linear-gradient(135deg, #00b4db, #00d2ff);
      color: #000000;
      border-top-right-radius: 2px;
      font-weight: 500;
    }
    .ai-row .bubble {
      background: rgba(255, 255, 255, 0.03);
      color: #ffffff;
      border-top-left-radius: 2px;
      border: 1px solid rgba(255, 255, 255, 0.06);
    }
    .time-stamp {
      font-size: 10px;
      color: rgba(255, 255, 255, 0.4);
      align-self: flex-end;
      margin-top: 5px;
    }
    .user-row .time-stamp {
      color: rgba(0, 0, 0, 0.5);
    }
    .diagnostic-panel {
      background: rgba(18, 18, 20, 0.6);
      border: 1px solid rgba(255, 255, 255, 0.06);
      border-radius: 8px;
      overflow: hidden;
      margin-top: 10px;
    }
    .diag-banner {
      background: rgba(0, 210, 255, 0.08);
      padding: 8px 12px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .diag-header-icon {
      color: #00d2ff;
      font-size: 16px;
      width: 16px;
      height: 16px;
    }
    .diag-title {
      font-size: 11px;
      font-weight: 700;
      color: #00d2ff;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .diag-grid {
      padding: 12px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
    }
    .diag-cell {
      display: flex;
      flex-direction: column;
    }
    .full-width-cell {
      grid-column: span 2;
    }
    .cell-label {
      font-size: 10px;
      color: #8c8c96;
      text-transform: uppercase;
      font-weight: 700;
      letter-spacing: 0.5px;
    }
    .cell-val {
      font-size: 13px;
      color: #ffffff;
      font-weight: 500;
      margin-top: 2px;
    }
    .parts-val {
      color: #ff9500;
      font-weight: 600;
    }
    .urgency-chip {
      align-self: flex-start;
      font-size: 11px;
      font-weight: 700;
      padding: 2px 10px;
      border-radius: 20px;
      margin-top: 2px;
    }
    .urgency-faible {
      background: rgba(52, 199, 89, 0.1);
      color: #30d158;
      border: 1px solid rgba(52, 199, 89, 0.2);
    }
    .urgency-moyen {
      background: rgba(255, 149, 0, 0.1);
      color: #ff9500;
      border: 1px solid rgba(255, 149, 0, 0.2);
    }
    .urgency-élevé {
      background: rgba(255, 59, 48, 0.1);
      color: #ff453a;
      border: 1px solid rgba(255, 59, 48, 0.2);
    }
    .font-success-box {
      background: rgba(52, 199, 89, 0.03);
      padding: 8px;
      border-radius: 6px;
      border: 1px solid rgba(52, 199, 89, 0.08);
    }
    .font-success {
      color: #30d158;
    }
    .off-topic-alert {
      display: flex;
      align-items: center;
      gap: 10px;
      background: rgba(255, 255, 255, 0.02);
      border: 1px solid rgba(255, 255, 255, 0.06);
      padding: 10px 14px;
      border-radius: 6px;
      color: #b0b0b8;
      font-size: 12px;
      margin-top: 5px;
    }
    .off-icon {
      color: #ff9500;
      font-size: 18px;
      width: 18px;
      height: 18px;
    }
    .typing-bubble {
      padding: 15px 20px !important;
    }
    .typing-indicator {
      display: flex;
      align-items: center;
      gap: 4px;
      height: 14px;
    }
    .typing-indicator span {
      width: 6px;
      height: 6px;
      background-color: #00d2ff;
      border-radius: 50%;
      opacity: 0.4;
      animation: typingBounce 1.4s infinite both;
    }
    .typing-indicator span:nth-child(2) {
      animation-delay: 0.2s;
    }
    .typing-indicator span:nth-child(3) {
      animation-delay: 0.4s;
    }
    @keyframes typingBounce {
      0%, 80%, 100% {
        transform: scale(0.6);
        opacity: 0.4;
      }
      40% {
        transform: scale(1.1);
        opacity: 1;
      }
    }
    .input-container {
      padding: 20px 25px;
      background: rgba(18, 18, 20, 0.4);
      display: flex;
      align-items: center;
      gap: 15px;
    }
    .message-input {
      flex: 1;
      height: 48px;
      background: rgba(255, 255, 255, 0.03);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 24px;
      padding: 0 20px;
      color: #ffffff;
      font-size: 14px;
      outline: none;
      transition: all 0.3s;
    }
    .message-input:focus {
      border-color: #00d2ff;
      box-shadow: 0 0 10px rgba(0, 210, 255, 0.15);
      background: rgba(255, 255, 255, 0.05);
    }
    .send-btn {
      background: linear-gradient(135deg, #00b4db, #00d2ff) !important;
      color: #000000 !important;
      box-shadow: 0 4px 15px rgba(0, 210, 255, 0.2) !important;
      transition: all 0.3s !important;
    }
    .send-btn:hover:not(:disabled) {
      transform: scale(1.05);
      box-shadow: 0 6px 18px rgba(0, 210, 255, 0.35) !important;
    }
    .send-btn:disabled {
      background: rgba(255, 255, 255, 0.08) !important;
      color: rgba(255, 255, 255, 0.3) !important;
      box-shadow: none !important;
    }
    .animate-slide-right {
      animation: slideRight 0.6s ease-out;
    }
    .animate-slide-left {
      animation: slideLeft 0.6s ease-out;
    }
    @keyframes slideRight {
      from {
        opacity: 0;
        transform: translateX(-30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }
    @keyframes slideLeft {
      from {
        opacity: 0;
        transform: translateX(30px);
      }
      to {
        opacity: 1;
        transform: translateX(0);
      }
    }

    /* Responsive adjustments */
    @media (max-width: 1024px) {
      .dashboard-grid {
        grid-template-columns: 1fr;
      }
      .chat-wrapper {
        padding: 20px;
      }
      .engine-pills {
        margin-left: unset;
        width: 100%;
        margin-top: 10px;
      }
    }
  `]
})
export class ChatAssistantComponent implements OnInit, OnDestroy, AfterViewChecked {
  private vehicleService = inject(VehicleService);
  private chatService = inject(ChatService);
  private router = inject(Router);

  @ViewChild('chatScrollContainer') private chatScrollContainer!: ElementRef;

  vehicle: VehicleMechanicalInfo | null = null;
  vehicleYear = '';
  sensitivePartsList: string[] = [];
  
  messages: ChatMessage[] = [];
  userInput = '';
  isWaitingForAi = false;

  private vehicleSub!: Subscription;
  private chatSub!: Subscription;

  ngOnInit(): void {
    // 1. Subscribe to vehicle selection state
    this.vehicleSub = this.vehicleService.selectedVehicle$.subscribe(data => {
      if (!data) {
        // Redirect if no vehicle was cached/selected
        this.router.navigate(['/select']);
        return;
      }
      this.vehicle = data;
      
      // Extract year from payload metadata
      const rawInfo = data as any;
      this.vehicleYear = rawInfo.year ? rawInfo.year.toString() : new Date().getFullYear().toString();

      // Split sensitive pieces string into individual items
      if (data.sensitiveParts) {
        this.sensitivePartsList = data.sensitiveParts.split(',').map(s => s.trim());
      }
    });

    // 2. Subscribe to dialogue list
    this.chatSub = this.chatService.messages$.subscribe(msgs => {
      this.messages = msgs;
      this.scrollToBottom();
    });
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  ngOnDestroy(): void {
    if (this.vehicleSub) this.vehicleSub.unsubscribe();
    if (this.chatSub) this.chatSub.unsubscribe();
  }

  onSend(): void {
    if (!this.userInput.trim() || !this.vehicle || this.isWaitingForAi) return;

    const messageText = this.userInput.trim();
    this.userInput = '';
    this.isWaitingForAi = true;
    this.scrollToBottom();

    // Call service to send message and trigger mock diagnostics
    this.chatService.sendMessage(this.vehicle.carModelId, messageText).subscribe({
      next: () => {
        this.isWaitingForAi = false;
        this.scrollToBottom();
      },
      error: (err) => {
        this.isWaitingForAi = false;
        console.error("Error processing AI chat response", err);
      }
    });
  }

  applyQuickPrompt(promptText: string): void {
    this.userInput = promptText;
    this.onSend();
  }

  private scrollToBottom(): void {
    try {
      if (this.chatScrollContainer) {
        this.chatScrollContainer.nativeElement.scrollTop = this.chatScrollContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      // Squelch scrolling errors
    }
  }
}
