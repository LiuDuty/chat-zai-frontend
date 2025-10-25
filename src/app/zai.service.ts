import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ZaiService {
  private backendUrl: string;

  constructor(private http: HttpClient) {
    // Detecta local ou produção
    this.backendUrl = window.location.hostname.includes('localhost')
      ? 'http://127.0.0.1:8000'
      : 'https://seu-backend.onrender.com';
  }

  enviarMensagem(texto: string, sessionId: string): Observable<any> {
    return this.http.post(`${this.backendUrl}/mensagem`, { texto, session_id: sessionId });
  }

  getHistorico(sessionId: string): Observable<any> {
    return this.http.get(`${this.backendUrl}/historico/${sessionId}`);
  }
}
