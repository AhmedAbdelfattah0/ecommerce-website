import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withPreloading, PreloadAllModules } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { httpInterceptor } from './common/services/http-interceptor.interceptor';
import { provideClientHydration } from '@angular/platform-browser';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({ scrollPositionRestoration: 'enabled' }),
      withPreloading(PreloadAllModules)
    ),
    provideHttpClient(withInterceptors([httpInterceptor])),
    provideAnimations(),
    provideClientHydration()
    // Service worker can be added after installing the package:
    // Run: ng add @angular/pwa
  ]
};
