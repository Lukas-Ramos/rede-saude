import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Aqui estamos fornecendo as rotas configuradas em app.routes.ts
    provideClientHydration()
  ]
};
