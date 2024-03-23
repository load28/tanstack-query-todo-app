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
import { Subscription } from 'rxjs';

const provideQuery = (qc: QueryClient) => {
  return makeEnvironmentProviders([
    provideAngularQuery(qc),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        qc.mount();
        const map = new Map<string, Subscription[]>();

        // todo 아래 동작들을 추상화 하여 각 소켓 별로 기능을 별도로 만들기
        const socketService = inject(SocketService);
        qc.getQueryCache().subscribe((cache) => {
          switch (cache.type) {
            case 'added': {
              if (
                cache.query.meta?.['month'] &&
                cache.query.queryKey[0] === 'todoList' &&
                cache.query.queryKey[1] === cache.query.meta['month']
              ) {
                socketService.joinTodoListRoom(
                  cache.query.meta['month'] as string,
                );
                const sub1 = socketService
                  .onTodoAdded()
                  .subscribe((data: Todo) => {
                    qc.setQueryData(
                      ['todoList', cache.query.meta!['month']],
                      (old: Todo[] | undefined) => {
                        const safeOld = old ?? [];
                        return [data, ...safeOld];
                      },
                    );
                  });
                const sub2 = socketService
                  .onTodoRemoved()
                  .subscribe((id: string) => {
                    qc.setQueryData(
                      ['todoList', cache.query.meta!['month']],
                      (old: Todo[] | undefined) => {
                        const safeOld = old ?? [];
                        return safeOld.filter((todo) => todo.id !== id);
                      },
                    );
                  });
                map.set(cache.query.meta['month'] as string, [sub1, sub2]);
              } else if (
                cache.query.meta?.['id'] &&
                cache.query.queryKey[0] === 'todo' &&
                cache.query.queryKey[1] === cache.query.meta['id']
              ) {
                socketService.joinTodoRoom(cache.query.meta['id'] as string);
              }
              break;
            }
            case 'removed': {
              if (
                cache.query.meta?.['month'] &&
                cache.query.queryKey[0] === 'todoList' &&
                cache.query.queryKey[1] === cache.query.meta['month']
              ) {
                socketService.leaveTodoListRoom(
                  cache.query.meta['month'] as string,
                );
                map.get(cache.query.meta['month'] as string)?.forEach((sub) => {
                  sub.unsubscribe();
                });
              } else if (
                cache.query.meta?.['id'] &&
                cache.query.queryKey[0] === 'todo' &&
                cache.query.queryKey[1] === cache.query.meta['id']
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
