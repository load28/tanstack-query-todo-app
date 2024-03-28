import { Todo } from '../../api/get-todo-list';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { TQueryCacheHandler } from '../index';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class TodoInfoCacheHandler
  implements TQueryCacheHandler<string[], Todo, Todo>
{
  private readonly queryClient = injectQueryClient();

  add(key: string[], data: Todo): Todo | undefined {
    return this.queryClient.setQueryData(key, (state: Todo | undefined) => {
      return data;
    }) as Todo;
  }

  remove(key: string[], id: string): Todo | undefined {
    return this.queryClient.setQueryData(key, (state: Todo | undefined) => {
      return undefined;
    });
  }

  update(key: string[], data: Todo): Todo | undefined {
    return this.queryClient.setQueryData(key, (state: Todo | undefined) => {
      return data;
    }) as Todo;
  }
}
