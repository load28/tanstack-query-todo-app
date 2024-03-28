import { injectQueryClient } from '@tanstack/angular-query-experimental';
import { TQueryCacheHandler } from '../index';
import { Injectable } from '@angular/core';
import { Todo } from '../../api/todo-api.model';

@Injectable({ providedIn: 'root' })
export class TodoListCacheHandler
  implements TQueryCacheHandler<string[], Todo, Todo[]>
{
  private readonly queryClient = injectQueryClient();

  add(key: string[], data: Todo): Todo[] | undefined {
    return this.queryClient.setQueryData(key, (state: Todo[] | undefined) => {
      return [data, ...getSafeTodoList(state)];
    }) as Todo[];
  }

  remove(key: string[], id: string): Todo[] | undefined {
    return this.queryClient.setQueryData(key, (state: Todo[] | undefined) => {
      return getSafeTodoList(state).filter((todo) => todo.id !== id);
    });
  }

  update(key: string[], data: Todo): Todo[] | undefined {
    return this.queryClient.setQueryData(key, (state: Todo[] | undefined) => {
      return getSafeTodoList(state).map((todo) =>
        todo.id === data.id ? data : todo,
      );
    });
  }
}

function getSafeTodoList(todoList: Todo[] | undefined): Todo[] {
  return todoList ?? [];
}
