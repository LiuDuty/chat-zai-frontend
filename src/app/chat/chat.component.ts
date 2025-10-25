import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ZaiService } from '../zai.service';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
})
export class ChatComponent {
  mensagem: string = '';
  respostas: string[] = [];

  constructor(private zaiService: ZaiService) {}

  enviar() {
    if (!this.mensagem) return;
    this.zaiService.enviarMensagem(this.mensagem).subscribe({
      next: (res) => {
        this.respostas.push(`Você: ${this.mensagem}`);
        this.respostas.push(`IA: ${res.resposta}`);
        this.mensagem = '';
      },
      error: (err) => console.error(err),
    });
  }
}
