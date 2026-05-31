import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';
import { UserService } from './service/user';
import { StorageService } from './service/storage';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHotToastConfig } from '@ngxpert/hot-toast';
import { NotificationService } from './service/notification';
import { TicketService } from './service/ticket';
import { DialogService } from '@ngneat/dialog';
import { ModalService } from './service/modal';
import { tokenInterceptor } from './interceptor/token.interceptor';
import { CacheService } from './service/cache.service';
import { FileStorageService } from './service/fileStorage.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes , withComponentInputBinding()),
    UserService,
    StorageService,
    NotificationService,
    TicketService,
    DialogService,
    ModalService,
    CacheService,
    FileStorageService,
    provideHttpClient(withInterceptors([tokenInterceptor])),
    provideHotToastConfig({
      position: 'top-right',
    }),
  ]
};
