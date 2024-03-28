import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { TodoListSocketHandler } from './query/todo-list/todo-list-socket-handler.service';
import { provideQuery, queryClient, QueryKeys } from './query';

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
