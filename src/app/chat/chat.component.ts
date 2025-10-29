import { Component, ElementRef, ViewChild, OnInit } from '@angular/core'; // 1. Importe OnInit
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
export class ChatComponent implements OnInit { // 2. Implemente a interface OnInit

  texto: string = '';
  conversas: { pergunta: string; resposta: string }[] = [];
  sessionId: string = 'session1';
  enviando: boolean = false;
  
  // 3. Crie uma chave única para o localStorage
  private readonly STORAGE_KEY = 'chatHistorico_zai';

  @ViewChild('chatBox') chatBox!: ElementRef;

  constructor(private zaiService: ZaiService) {}

  // 4. Implemente o método ngOnInit, que é executado quando o componente é criado
  ngOnInit(): void {
    this.carregarHistorico();
  }

  // 5. Crie um método para carregar o histórico do localStorage
  carregarHistorico(): void {
    const historicoSalvo = localStorage.getItem(this.STORAGE_KEY);
    if (historicoSalvo) {
      try {
        // Convertemos a string JSON de volta para um array de objetos
        this.conversas = JSON.parse(historicoSalvo);
        // Rola para o final para mostrar a última mensagem carregada
        setTimeout(() => this.scrollParaFim(), 100);
      } catch (error) {
        console.error('Erro ao carregar histórico do localStorage:', error);
        // Se os dados estiverem corrompidos, limpa o localStorage para evitar erros futuros
        localStorage.removeItem(this.STORAGE_KEY);
      }
    }
  }

  // 6. Crie um método para salvar o histórico no localStorage
  salvarHistorico(): void {
    // Convertemos o array de objetos para uma string JSON
    const historicoParaSalvar = JSON.stringify(this.conversas);
    localStorage.setItem(this.STORAGE_KEY, historicoParaSalvar);
  }

  enviar() {
    const pergunta = this.texto.trim();
    if (!pergunta || this.enviando) return;

    this.enviando = true;

    this.conversas.push({ pergunta, resposta: '⏳ Digitando...' });
    this.texto = '';
    this.scrollParaFim();

    this.zaiService.enviarMensagem(pergunta, this.sessionId).subscribe({
      next: (res: any) => {
        const respostaComBr = res.resposta
          ? res.resposta.replace(/\n/g, '<br>')
          : '⚠️ Sem resposta do servidor.';
        this.conversas[this.conversas.length - 1].resposta = respostaComBr;
        this.enviando = false;
        this.scrollParaFim();
        
        // 7. Salva o histórico após receber a resposta com sucesso
        this.salvarHistorico();
      },
      error: (err: any) => {
        console.error('❌ Erro ao enviar mensagem', err);
        this.conversas[this.conversas.length - 1].resposta =
          '💥 Erro ao obter resposta. Tente novamente.';
        this.enviando = false;
        
        // 8. Salva o histórico mesmo em caso de erro, para persistir a tentativa
        this.salvarHistorico();
      },
    });
  }

  scrollParaFim() {
    setTimeout(() => {
      const el = this.chatBox?.nativeElement;
      if (el) el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
    }, 100);
  }

  // (Opcional) Método para limpar o histórico
  limparHistorico(): void {
    this.conversas = [];
    localStorage.removeItem(this.STORAGE_KEY);
  }
}