import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent implements OnInit {
  mensagem = '';
  respostas: { role: string; content: string }[] = [];
  sessionId: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Recupera sessão salva ou cria nova
    const sessaoSalva = localStorage.getItem('session_id');
    if (sessaoSalva) {
      this.sessionId = sessaoSalva;
      const historico = localStorage.getItem('chat_respostas');
      if (historico) {
        this.respostas = JSON.parse(historico);
      }
    } else {
      this.sessionId = this.gerarSessionId();
      localStorage.setItem('session_id', this.sessionId);
    }
  }

  gerarSessionId(): string {
    return 'sessao-' + Date.now();
  }

  enviar() {
    if (!this.mensagem.trim()) return;

    // adiciona mensagem do usuário localmente
    this.respostas.push({ role: 'user', content: this.mensagem });
    this.salvarHistorico();

    const payload = {
      texto: this.mensagem,
      session_id: this.sessionId,
    };

    // 🔗 altere a URL abaixo para o endereço real do seu backend no Render
    this.http
      .post<{ resposta: string }>('https://seu-backend.onrender.com/mensagem', payload)
      .subscribe({
        next: (res) => {
          this.respostas.push({ role: 'assistant', content: res.resposta });
          this.salvarHistorico();
        },
        error: (err) => {
          console.error('Erro ao enviar mensagem:', err);
        },
      });

    this.mensagem = '';
  }

  salvarHistorico() {
    localStorage.setItem('chat_respostas', JSON.stringify(this.respostas));
  }
}
