import { Injectable } from '@angular/core';
import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { Todo } from '../../api/todo-api.model';
import { TQueryCacheHandler } from '../index';

@Injectable({ providedIn: 'root' })
export class TodoInfoCacheHandler implements TQueryCacheHandler<string[], Todo, Todo> {
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
