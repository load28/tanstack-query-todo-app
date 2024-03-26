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
import { TodoListSocketDispatcher } from './query/todo-list/todo-list-socket-dispatcher';
import { TQueryEventDispatcherClass } from './query';
import { QueryEventListenerExecutor } from './query/runner/query-event-listener-executor';

const provideQuery = (
  qc: QueryClient,
  sd: Record<string, TQueryEventDispatcherClass>,
) => {
  return makeEnvironmentProviders([
    provideAngularQuery(qc),
    // ...Object.values(sd),
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const queryEventListenerExecutor = inject(QueryEventListenerExecutor);
        const sub = queryEventListenerExecutor.run(sd);

        inject(DestroyRef).onDestroy(() => {
          sub();
        });
      },
    },
  ]);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 4,
      staleTime: Infinity,
    },
  },
});

export const QueryKeys = {
  todoList: 'todoList',
} as const;

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideAnimationsAsync(),
    provideNativeDateAdapter(),
    provideQuery(queryClient, {
      [QueryKeys.todoList]: TodoListSocketDispatcher,
    }),
  ],
};
