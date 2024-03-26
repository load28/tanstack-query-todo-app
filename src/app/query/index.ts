import { QueryCacheNotifyEvent } from '@tanstack/angular-query-experimental';

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
