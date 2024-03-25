import { QueryCacheNotifyEvent } from '@tanstack/angular-query-experimental';

export interface TQueryCacheDispatcher<K, T, S> {
  add(key: K, data: T): S | undefined;

  update(key: K, data: T): S | undefined;

  remove(key: K, id: string): S | undefined;
}

export interface TQueryCacheSocketDispatcher<
  K = unknown,
  T = unknown,
  S = unknown,
  M = unknown,
> extends TQueryCacheDispatcher<K, T, S> {
  join(key: K, qe: QueryCacheNotifyEvent): void;

  leave(key: K, qe: QueryCacheNotifyEvent): void;

  keyGuard(key: K, meta: M): boolean;
}

export type TSocketDispatcherClass = new () => TQueryCacheSocketDispatcher;
