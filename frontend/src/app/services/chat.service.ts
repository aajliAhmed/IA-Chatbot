import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { ChatRequest, ChatResponse, ChatMessage } from '../models/chat.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/chat';

  private messagesSubject = new BehaviorSubject<ChatMessage[]>([]);
  messages$ = this.messagesSubject.asObservable();

  sendMessage(modelId: number, messageText: string): Observable<ChatResponse> {
    // Add user message to local history instantly
    const userMsg: ChatMessage = {
      sender: 'user',
      text: messageText,
      timestamp: new Date()
    };
    this.addMessage(userMsg);

    const payload: ChatRequest = { modelId, message: messageText };
    return this.http.post<ChatResponse>(this.apiUrl, payload).pipe(
      tap(res => {
        // Add AI structured response to history
        const aiMsg: ChatMessage = {
          sender: 'ai',
          text: res.replyText,
          diagnosticDetails: res,
          timestamp: new Date()
        };
        this.addMessage(aiMsg);
      })
    );
  }

  addMessage(msg: ChatMessage): void {
    const current = this.messagesSubject.value;
    this.messagesSubject.next([...current, msg]);
  }

  clearHistory(): void {
    this.messagesSubject.next([]);
  }
}
