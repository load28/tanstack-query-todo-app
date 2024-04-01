import { provideHttpClient } from '@angular/common/http';
import { ApplicationConfig } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideQuery, queryClient, QueryKeys } from './query';
import { TodoListSocketHandler } from './query/todo-list/todo-list-socket-handler.service';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideQuery(queryClient, {
      [QueryKeys.todoList]: TodoListSocketHandler,
    }),
  ],
};
