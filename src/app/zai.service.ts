import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Resposta {
  resposta: string;
}

@Injectable({
  providedIn: 'root',
})
export class ZaiService {
  private apiUrl = 'http://localhost:8000/mensagem'; // backend local FastAPI

  constructor(private http: HttpClient) {}

  enviarMensagem(texto: string): Observable<Resposta> {
    return this.http.post<Resposta>(this.apiUrl, { texto });
  }
}
