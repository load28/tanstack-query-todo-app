import {
  ApplicationConfig,
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
import {
  QueryCacheSocketDispatcherRunner,
  TodoListQueryCacheDispatcher,
  TodoListSocketDispatcher,
  TQueryCacheSocketDispatcherClass,
} from './query-provider.service';

const provideQuery = (
  qc: QueryClient,
  sd: TQueryCacheSocketDispatcherClass[],
) => {
  return makeEnvironmentProviders([
    provideAngularQuery(qc),
    QueryCacheSocketDispatcherRunner,
    TodoListSocketDispatcher,
    TodoListQueryCacheDispatcher,
    {
      provide: ENVIRONMENT_INITIALIZER,
      multi: true,
      useValue: () => {
        const queryCacheSocketDispatcherRunner = inject(
          QueryCacheSocketDispatcherRunner,
        );
        queryCacheSocketDispatcherRunner.run(sd);
      },
    },
  ]);
};

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 5000,
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
    provideQuery(queryClient, [TodoListSocketDispatcher]),
  ],
};
