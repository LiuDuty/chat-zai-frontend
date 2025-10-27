import { bootstrapApplication } from '@angular/platform-browser';
import { importProvidersFrom } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(
      FormsModule, // 👈 Suporte ao [(ngModel)]
      HttpClientModule // 👈 Suporte a chamadas HTTP
    ),
  ],
}).catch((err) => console.error(err));
