import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter ,withInMemoryScrolling  } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideToastr } from 'ngx-toastr';
export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes,   withInMemoryScrolling({
        scrollPositionRestoration: 'top', 
      })) , provideHttpClient(), provideAnimations(), provideToastr()]
};
