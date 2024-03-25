import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { inject, Injectable, Injector } from '@angular/core';
import { TSocketDispatcherClass } from './index';

@Injectable({ providedIn: 'root' })
export class QueryCacheSocketDispatcherRunner<K> {
  private readonly queryClient = injectQueryClient();
  private readonly injector = inject(Injector);

  run(ds: TSocketDispatcherClass[]): () => void {
    return this.queryClient.getQueryCache().subscribe((qe) => {
      ds.forEach((dispatcherClass: TSocketDispatcherClass) => {
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
