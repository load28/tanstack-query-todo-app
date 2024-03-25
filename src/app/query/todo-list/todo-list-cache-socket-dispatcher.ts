import { inject, Injectable } from '@angular/core';
import { Todo } from '../../api/get-todo-list';
import { SocketService } from '../../socket.service';
import { filter, Subscription } from 'rxjs';
import { QueryCacheNotifyEvent } from '@tanstack/angular-query-experimental';
import { TodoListQueryCacheDispatcher } from './todo-list-cache-dispatcher';

import { TQueryCacheSocketDispatcher } from '../index';

@Injectable()
export class TodoListSocketDispatcher
  extends TodoListQueryCacheDispatcher
  implements
    TQueryCacheSocketDispatcher<string[], Todo, Todo[], { month: string }>
{
  private readonly socketService = inject(SocketService);

  subs: Subscription[] | undefined;

  keyGuard(key: string[], { month }: { month: string }): boolean {
    return key[0] === 'todoList' && key[1] === month;
  }

  join(key: string[], qe: QueryCacheNotifyEvent): void {
    const currentMonth = key[1];
    this.socketService.joinTodoListRoom(currentMonth);
    this.subs = this.subscribeSocketEvents(key, qe);
  }

  subscribeSocketEvents(
    key: string[],
    qe: QueryCacheNotifyEvent,
  ): Subscription[] {
    const { month: metaMonth } = qe.query.meta as { month: string };

    const addSub = this.socketService
      .onTodoAdded()
      .pipe(
        filter((todo: Todo) => {
          return todo.month === metaMonth;
        }),
      )
      .subscribe((data: Todo) => {
        this.add(key, data);
      });
    const removeSub = this.socketService
      .onTodoRemoved()
      .pipe(
        filter(({ month }: { id: string; month: string }) => {
          return month === metaMonth;
        }),
      )
      .subscribe(({ id, month }) => {
        this.remove(key, id);
      });
    const updateSub = this.socketService
      .onTodoUpdated()
      .pipe(
        filter((todo: Todo) => {
          return todo.month === metaMonth;
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
