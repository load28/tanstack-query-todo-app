import { inject, Injectable, Injector } from '@angular/core';
import {
  injectQueryClient,
  QueryCacheNotifyEvent,
} from '@tanstack/angular-query-experimental';
import { SocketService } from './socket.service';
import { filter, Subscription } from 'rxjs';
import { Todo } from './api/get-todo-list';

export type TQueryCacheSocketDispatcherClass = new () => SocketDispatcher;

export interface TQueryCacheDispatcher<K, T, S> {
  add(key: K, data: T): S | undefined;
  update(key: K, data: T): S | undefined;
  remove(key: K, id: string): S | undefined;
}

export interface SocketDispatcher<K = unknown, T = unknown, S = unknown>
  extends TQueryCacheDispatcher<K, T, S> {
  join(key: K, qe: QueryCacheNotifyEvent): void;
  leave(key: K, qe: QueryCacheNotifyEvent): void;
}

@Injectable({ providedIn: 'root' })
export class QueryCacheSocketDispatcherRunner<K> {
  private readonly queryClient = injectQueryClient();
  private readonly injector = inject(Injector);

  run(ds: TQueryCacheSocketDispatcherClass[]): void {
    this.queryClient.getQueryCache().subscribe((qe) => {
      ds.forEach((dispatcherClass) => {
        const dispatcher = this.injector.get(dispatcherClass);

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

export class TodoListQueryCacheDispatcher
  implements TQueryCacheDispatcher<string[], Todo, Todo[]>
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

@Injectable()
export class TodoListSocketDispatcher
  extends TodoListQueryCacheDispatcher
  implements SocketDispatcher<string[], Todo, Todo[]>
{
  private readonly socketService = inject(SocketService);

  subs: Subscription[] | undefined;

  join(key: string[]): void {
    const currentMonth = key[1];
    this.socketService.joinTodoListRoom(currentMonth);
    this.subs = this.subscribeSocketEvents(key);
  }

  subscribeSocketEvents(key: string[]): Subscription[] {
    const currentFeatureKey = key[0];
    const currentMonth = key[1];

    if (currentFeatureKey !== 'todoList') {
      return [];
    }

    const addSub = this.socketService
      .onTodoAdded()
      .pipe(
        filter((todo: Todo) => {
          return todo.month === currentMonth;
        }),
      )
      .subscribe((data: Todo) => {
        this.add(key, data);
      });
    const removeSub = this.socketService
      .onTodoRemoved()
      .pipe(
        filter(({ month }: { id: string; month: string }) => {
          return month === currentMonth;
        }),
      )
      .subscribe(({ id, month }) => {
        this.remove(key, id);
      });
    const updateSub = this.socketService
      .onTodoUpdated()
      .pipe(
        filter((todo: Todo) => {
          return todo.month === currentMonth;
        }),
      )
      .subscribe((data: Todo) => {
        this.update(key, data);
      });

    return [addSub, removeSub, updateSub];
  }

  leave(key: string[]): void {
    this.socketService.leaveTodoListRoom(key[1]);
    this.unsubscribeSocketEvents();
  }

  unsubscribeSocketEvents(): void {
    this.subs?.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
