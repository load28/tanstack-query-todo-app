import {
  injectQueryClient,
  QueryCacheNotifyEvent,
} from '@tanstack/angular-query-experimental';
import { TQueryCacheDispatcher } from './todo-list/todo-list-cache-dispatcher';
import { inject, Injectable, Injector } from '@angular/core';

export interface SocketDispatcher<
  K = unknown,
  T = unknown,
  S = unknown,
  M = unknown,
> extends TQueryCacheDispatcher<K, T, S> {
  join(key: K, qe: QueryCacheNotifyEvent): void;
  leave(key: K, qe: QueryCacheNotifyEvent): void;
  keyGuard(key: K, meta: M): boolean;
}

export type TSocketDispatcherClass = new () => SocketDispatcher;

@Injectable({ providedIn: 'root' })
export class QueryCacheSocketDispatcherRunner<K> {
  private readonly queryClient = injectQueryClient();
  private readonly injector = inject(Injector);

  run(ds: TSocketDispatcherClass[]): void {
    this.queryClient.getQueryCache().subscribe((qe) => {
      ds.forEach((dispatcherClass) => {
        const dispatcher = this.injector.get(dispatcherClass);

        if (!dispatcher.keyGuard(qe.query.queryKey as K, qe.query.meta)) {
          return;
        }

        switch (qe.type) {
          case 'added': {
            dispatcher.join(qe.query.queryKey as K, qe);
            break;
          }
          case 'removed': {
            dispatcher.leave(qe.query.queryKey as K, qe);
            break;
          }
        }
      });
    });
  }
}
