import { DestroyRef, ENVIRONMENT_INITIALIZER, inject, makeEnvironmentProviders } from '@angular/core';
import { provideAngularQuery, QueryCacheNotifyEvent, QueryClient } from '@tanstack/angular-query-experimental';
import { QueryEventListenerExecutor } from './runner/query-event-listener-executor';

export interface TQueryCacheHandler<K, T, S> {
  add(key: K, data: T): S | undefined;

  update(key: K, data: T): S | undefined;

  remove(key: K, id: string): S | undefined;
}

export interface TQueryEvenHandler {
  isEqual(qe: QueryCacheNotifyEvent): boolean;

  handleQueryEvent(qe: QueryCacheNotifyEvent): void;
}

export type TQueryEventDispatcherClass = new () => TQueryEvenHandler;
export const provideQuery = (qc: QueryClient, sd: Record<string, TQueryEventDispatcherClass>) => {
  return makeEnvironmentProviders([
    provideAngularQuery(qc),
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
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: 1000 * 2,
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnReconnect: false,
      refetchOnWindowFocus: false,
      retry: false,
    },
  },
});

export const QueryKeys = {
  todoList: 'todoList',
  todoInfo: 'todoInfo',
} as const;
