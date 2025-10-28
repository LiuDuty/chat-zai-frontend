import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ZaiService } from '../zai.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  texto: string = '';
  conversas: { pergunta: string; resposta: string }[] = [];
  sessionId: string = 'session1';
  enviando: boolean = false;

  @ViewChild('chatBox') chatBox!: ElementRef;

  constructor(private zaiService: ZaiService) {}

  enviar() {
    const pergunta = this.texto.trim();
    if (!pergunta || this.enviando) return;

    this.enviando = true;

    // adiciona a pergunta na tela com placeholder "digitando..."
    this.conversas.push({ pergunta, resposta: '⏳ Digitando...' });
    this.texto = '';
    this.scrollParaFim();

    // faz a requisição ao backend
    this.zaiService.enviarMensagem(pergunta, this.sessionId).subscribe({
      next: (res: any) => {
        const respostaComBr = res.resposta
          ? res.resposta.replace(/\n/g, '<br>')
          : '⚠️ Sem resposta do servidor.';
        this.conversas[this.conversas.length - 1].resposta = respostaComBr;
        this.enviando = false;
        this.scrollParaFim();
      },
      error: (err: any) => {
        console.error('❌ Erro ao enviar mensagem', err);
        this.conversas[this.conversas.length - 1].resposta =
          '💥 Erro ao obter resposta. Tente novamente.';
        this.enviando = false;
      },
    });
  }

  scrollParaFim() {
    setTimeout(() => {
      const el = this.chatBox?.nativeElement;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, 100);
  }
}
