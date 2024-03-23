import {
  ApplicationConfig,
  DestroyRef,
  ENVIRONMENT_INITIALIZER,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import {
  provideAngularQuery,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import { provideHttpClient } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { SocketService } from './socket.service';
import { Todo } from './api/get-todo-list';

const provideQuery = (qc: QueryClient) => {
  return makeEnvironmentProviders([
    provideAngularQuery(qc),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        qc.mount();

        const socketService = inject(SocketService);
        qc.getQueryCache().subscribe((cache) => {
          switch (cache.type) {
            case 'added': {
              if (
                cache.query.queryKey[0] === 'todoList' &&
                cache.query.meta?.['month']
              ) {
                socketService.joinTodoListRoom(
                  cache.query.meta['month'] as string,
                );
                socketService.onTodoAdded().subscribe((data) => {
                  qc.setQueryData(
                    ['todoList', cache.query.meta!['month']],
                    (old: Todo[]) => {
                      console.log('todoList added', data);
                      return [data, ...old];
                    },
                  );
                });
              } else if (
                cache.query.queryKey[0] === 'todo' &&
                cache.query.meta?.['id']
              ) {
                socketService.joinTodoRoom(cache.query.meta['id'] as string);
              }
              break;
            }
            case 'removed': {
              if (
                cache.query.queryKey[0] === 'todoList' &&
                cache.query.meta?.['month']
              ) {
                socketService.leaveTodoListRoom(
                  cache.query.meta['month'] as string,
                );
              } else if (
                cache.query.queryKey[0] === 'todo' &&
                cache.query.meta?.['id']
              ) {
                socketService.leaveTodoRoom(cache.query.meta['id'] as string);
              }
              break;
            }
          }
        });
        inject(DestroyRef).onDestroy(() => {
          qc.unmount();
        });
      },
    },
  ]);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 2000,
      staleTime: Infinity,
    },
  },
});

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideQuery(queryClient),
  ],
};
