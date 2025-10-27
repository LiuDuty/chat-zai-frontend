import { Component, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true, // 👈 Importante para standalone component
  imports: [CommonModule, FormsModule], // 👈 Aqui adiciona os módulos necessários
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  texto: string = '';
  conversas: { pergunta: string; resposta: string }[] = [];

  @ViewChild('chatBox') chatBox!: ElementRef;

  enviar() {
    if (!this.texto.trim()) return;

    const pergunta = this.texto.trim();
    this.texto = '';

    const resposta = this.gerarResposta(pergunta);
    this.conversas.push({ pergunta, resposta });

    setTimeout(() => this.scrollParaFim(), 50);
  }

  gerarResposta(pergunta: string): string {
    return `Resposta gerada para: "${pergunta}"`;
  }

  scrollParaFim() {
    const el = this.chatBox?.nativeElement;
    if (el) el.scrollTop = el.scrollHeight;
  }
}
