import { Component } from '@angular/core';
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
  mensagens: string[] = [];
  texto: string = '';
  sessionId: string = 'session1';

  constructor(private zaiService: ZaiService) {}

  enviar() {
    if (!this.texto) return;

    this.zaiService.enviarMensagem(this.texto, this.sessionId).subscribe({
      next: (res: any) => {
        this.mensagens.push('Você: ' + this.texto);
        this.mensagens.push('Assistente: ' + res.resposta);
        this.texto = '';
      },
      error: (err: any) => console.error('Erro ao enviar mensagem', err),
    });
  }
}
