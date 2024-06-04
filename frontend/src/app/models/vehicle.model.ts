export interface Brand {
  id: number;
  name: string;
}

export interface CarModel {
  id: number;
  name: string;
  brandId: number;
}

export interface VehicleMechanicalInfo {
  id: number;
  carModelId: number;
  modelName: string;
  brandName: string;
  engineType: string;
  oilCapacity: string;
  oilType: string;
  horsepower: string;
  fuelType: string;
  transmission: string;
  tirePressure: string;
  recommendedBattery: string;
  averageConsumption: string;
  maintenanceFrequency: string;
  commonProblems: string;
  sensitiveParts: string;
}
