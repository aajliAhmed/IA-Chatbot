import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { Brand, CarModel, VehicleMechanicalInfo } from '../models/vehicle.model';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api';

  private selectedVehicleSubject = new BehaviorSubject<VehicleMechanicalInfo | null>(this.getCachedVehicle());
  selectedVehicle$ = this.selectedVehicleSubject.asObservable();

  getBrands(): Observable<Brand[]> {
    return this.http.get<Brand[]>(`${this.apiUrl}/brands`);
  }

  getModels(brandId: number): Observable<CarModel[]> {
    return this.http.get<CarModel[]>(`${this.apiUrl}/brands/${brandId}/models`);
  }

  getMechanicalInfo(modelId: number): Observable<VehicleMechanicalInfo> {
    return this.http.get<VehicleMechanicalInfo>(`${this.apiUrl}/vehicle/${modelId}/mechanical-data`).pipe(
      tap(info => this.selectVehicle(info))
    );
  }

  selectVehicle(vehicle: VehicleMechanicalInfo | null): void {
    if (vehicle) {
      localStorage.setItem('selected_vehicle', JSON.stringify(vehicle));
    } else {
      localStorage.removeItem('selected_vehicle');
    }
    this.selectedVehicleSubject.next(vehicle);
  }

  getSelectedVehicle(): VehicleMechanicalInfo | null {
    return this.selectedVehicleSubject.value;
  }

  private getCachedVehicle(): VehicleMechanicalInfo | null {
    const cached = localStorage.getItem('selected_vehicle');
    if (cached) {
      try {
        return JSON.parse(cached);
      } catch (e) {
        return null;
      }
    }
    return null;
  }
}
