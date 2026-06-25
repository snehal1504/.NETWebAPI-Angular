import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

import { App } from './app/app';
import { routes } from './app/app.routes';
import { JwtInterceptor } from './app/jwt-interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

bootstrapApplication(App, {
  providers: [
    provideRouter(routes),
    // 👇 register HttpClient and tell Angular to use DI interceptors
    provideHttpClient(withInterceptorsFromDi()),
    // 👇 register your JwtInterceptor
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true }
  ]
}).catch((err) => console.error(err));
