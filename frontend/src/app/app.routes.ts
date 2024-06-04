import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { VehicleSelectionComponent } from './pages/vehicle-selection/vehicle-selection.component';
import { ChatAssistantComponent } from './pages/chat-assistant/chat-assistant.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'select', component: VehicleSelectionComponent, canActivate: [authGuard] },
  { path: 'chat', component: ChatAssistantComponent, canActivate: [authGuard] },
  { path: '', redirectTo: '/select', pathMatch: 'full' },
  { path: '**', redirectTo: '/select' }
];
