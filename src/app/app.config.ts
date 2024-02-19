import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient } from '@angular/common/http';
import { CatassApiService } from './cataas-api/catass-api.service';

export const appConfig: ApplicationConfig = {
  providers: [provideHttpClient(), CatassApiService, provideRouter(routes)],
};
