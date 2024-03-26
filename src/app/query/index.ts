import {
  provideAngularQuery,
  QueryCacheNotifyEvent,
  QueryClient,
} from '@tanstack/angular-query-experimental';
import {
  DestroyRef,
  ENVIRONMENT_INITIALIZER,
  inject,
  makeEnvironmentProviders,
} from '@angular/core';
import { QueryEventListenerExecutor } from './runner/query-event-listener-executor';

export interface TQueryCacheHandler<K, T, S> {
  add(key: K, data: T): S | undefined;

  update(key: K, data: T): S | undefined;

  remove(key: K, id: string): S | undefined;
}

export interface TQueryEvenDispatcher {
  isEqual(qe: QueryCacheNotifyEvent): boolean;

  dispatch(qe: QueryCacheNotifyEvent): void;
}

export type TQueryEventDispatcherClass = new () => TQueryEvenDispatcher;
export const provideQuery = (
  qc: QueryClient,
  sd: Record<string, TQueryEventDispatcherClass>,
) => {
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
      gcTime: 1000 * 4,
      staleTime: Infinity,
    },
  },
});

export const QueryKeys = {
  todoList: 'todoList',
} as const;
