import { inject, Injectable, Injector } from '@angular/core';
import { injectQueryClient, QueryCacheNotifyEvent } from '@tanstack/angular-query-experimental';
import { TQueryEvenHandler, TQueryEventDispatcherClass } from '../index';

@Injectable({ providedIn: 'root' })
export class QueryEventListenerExecutor {
  private readonly queryClient = injectQueryClient();
  private readonly injector = inject(Injector);
  private readonly serviceInstances = new Map<string, TQueryEvenHandler>();

  run(classes: Record<string, TQueryEventDispatcherClass>): () => void {
    return this.queryClient.getQueryCache().subscribe((qn) => {
      const domainKey = qn.query.queryKey[0];
      const dispatcherClass = classes[domainKey];

      if (!dispatcherClass) {
        return;
      }

      let serviceInstances = this.getServiceInstance(qn, dispatcherClass);

      if (!serviceInstances.isEqual(qn)) {
        return;
      }

      serviceInstances.handleQueryEvent(qn);

      if (qn.type === 'removed') {
        this.serviceInstances.delete(qn.query.queryHash);
      }
    });
  }

  private getServiceInstance(
    qn: QueryCacheNotifyEvent,
    dispatcherClass: TQueryEventDispatcherClass,
  ): TQueryEvenHandler {
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
