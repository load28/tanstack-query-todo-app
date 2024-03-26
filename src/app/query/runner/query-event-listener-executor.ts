import {
  injectQueryClient,
  QueryCacheNotifyEvent,
} from '@tanstack/angular-query-experimental';
import { inject, Injectable, Injector } from '@angular/core';
import { TQueryEvenDispatcher, TQueryEventDispatcherClass } from '../index';

@Injectable({ providedIn: 'root' })
export class QueryEventListenerExecutor {
  private readonly queryClient = injectQueryClient();
  private readonly injector = inject(Injector);
  private readonly serviceInstances = new Map<string, TQueryEvenDispatcher>();

  run(ql: Record<string, TQueryEventDispatcherClass>): () => void {
    return this.queryClient.getQueryCache().subscribe((qn) => {
      const domainKey = qn.query.queryKey[0];
      const dispatcherClass = ql[domainKey];

      if (!dispatcherClass) {
        this.handleMissingDispatcher(domainKey);
        return;
      }

      let serviceInstances = this.getServiceInstance(qn, dispatcherClass);

      if (!serviceInstances.isEqual(qn)) {
        return;
      }

      serviceInstances.dispatch(qn);

      if (qn.type === 'removed') {
        this.serviceInstances.delete(qn.query.queryHash);
      }
    });
  }

  // Handle missing dispatcher
  private handleMissingDispatcher(domainKey: string): void {
    console.warn('No query event dispatcher for', domainKey);
  }
  private getServiceInstance(
    qn: QueryCacheNotifyEvent,
    dispatcherClass: TQueryEventDispatcherClass,
  ): TQueryEvenDispatcher {
    return (
      this.serviceInstances.get(qn.query.queryHash) ||
      (() => {
        const injector = Injector.create({
          parent: this.injector,
          providers: [{ provide: dispatcherClass, useClass: dispatcherClass }],
        });
        const newInstance = injector.get(dispatcherClass);
        this.serviceInstances.set(qn.query.queryHash, newInstance);
        return newInstance;
      })()
    );
  }
}
