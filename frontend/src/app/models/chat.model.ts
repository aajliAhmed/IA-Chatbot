export interface ChatRequest {
  modelId: number;
  message: string;
}

export interface ChatResponse {
  probableDiagnostic: string;
  possibleCause: string;
  urgencyLevel: 'AUCUN' | 'FAIBLE' | 'MOYEN' | 'ÉLEVÉ';
  checkAdvice: string;
  concernedParts: string;
  maintenanceRecommendation: string;
  replyText: string;
  timestamp: string;
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  diagnosticDetails?: ChatResponse;
  timestamp: Date;
}
