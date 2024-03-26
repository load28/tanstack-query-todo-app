import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { inject, Injectable, Injector } from '@angular/core';
import { TQueryEvenDispatcher, TQueryEventDispatcherClass } from '../index';

@Injectable({ providedIn: 'root' })
export class QueryEventListenerExecutor {
  private readonly queryClient = injectQueryClient();
  private readonly injector = inject(Injector);
  private readonly serviceInstances = new Map<string, TQueryEvenDispatcher>();

  run(ql: Record<string, TQueryEventDispatcherClass>): () => void {
    return this.queryClient.getQueryCache().subscribe((qe) => {
      const domainKey = qe.query.queryKey[0];
      const dispatcherClass = ql[domainKey];
      if (!dispatcherClass) {
        console.warn('No query event dispatcher for', domainKey);
        return;
      }

      const serviceInstances = this.createOrGetServiceInstance(
        JSON.stringify(qe.query.queryKey),
        dispatcherClass,
      );

      if (!serviceInstances.isEqual(qe)) {
        return;
      }

      serviceInstances.dispatch(qe);

      if (qe.type === 'removed') {
        this.serviceInstances.delete(JSON.stringify(qe.query.queryKey));
      }
    });
  }

  createOrGetServiceInstance(
    key: string,
    classType: TQueryEventDispatcherClass,
  ): TQueryEvenDispatcher {
    if (this.serviceInstances.has(key)) {
      return this.serviceInstances.get(key)!;
    }

    const instance = this.injector.get(classType);
    this.serviceInstances.set(key, instance);

    return instance;
  }
}
