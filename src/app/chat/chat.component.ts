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

  @ViewChild('chatBox') chatBox!: ElementRef;

  constructor(private zaiService: ZaiService) {}

  enviar() {
    const pergunta = this.texto.trim();
    if (!pergunta) return;

    // adiciona imediatamente a pergunta na tela
    this.conversas.push({ pergunta, resposta: '...' });
    this.texto = '';

    // faz a requisição para o backend
    this.zaiService.enviarMensagem(pergunta, this.sessionId).subscribe({
      next: (res: any) => {
        const respostaComBr = res.resposta.replace(/\n/g, '<br>');
        this.conversas[this.conversas.length - 1].resposta = respostaComBr;
        this.scrollParaFim();
      },
      error: (err: any) => {
        this.conversas[this.conversas.length - 1].resposta = 'Erro ao obter resposta.';
        console.error('Erro ao enviar mensagem', err);
      },
    });

    // scroll suave pro final
    setTimeout(() => this.scrollParaFim(), 100);
  }

  scrollParaFim() {
    const el = this.chatBox?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
