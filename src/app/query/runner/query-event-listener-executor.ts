import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { inject, Injectable, Injector } from '@angular/core';
import { TQueryEvenDispatcher, TQueryEventDispatcherClass } from '../index';

@Injectable({ providedIn: 'root' })
export class QueryEventListenerExecutor {
  private readonly queryClient = injectQueryClient();
  private readonly injector = inject(Injector);

  run(ql: Record<string, TQueryEventDispatcherClass>): () => void {
    return this.queryClient.getQueryCache().subscribe((qe) => {
      const domainKey = qe.query.queryKey[0];
      const dispatcherClass = ql[domainKey];
      if (!dispatcherClass) {
        console.warn('No query event dispatcher for', domainKey);
        return;
      }

      const serviceInstances = this.injector.get(dispatcherClass);

      if (!serviceInstances.isEqual(qe)) {
        return;
      }

      serviceInstances.dispatch(qe);
    });
  }
}
