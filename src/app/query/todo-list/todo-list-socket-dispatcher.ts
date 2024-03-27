import { inject, Injectable } from '@angular/core';
import { Todo } from '../../api/get-todo-list';
import { SocketService } from '../../socket.service';
import { filter, Subscription } from 'rxjs';
import { QueryCacheNotifyEvent } from '@tanstack/angular-query-experimental';
import { TQueryEvenDispatcher } from '../index';
import { TodoListCacheDispatcher } from './todo-list-cache-dispatcher';

@Injectable()
export class TodoListSocketDispatcher
  extends TodoListCacheDispatcher
  implements TQueryEvenDispatcher
{
  private readonly socketService = inject(SocketService);

  subs: Subscription[] | undefined;

  isEqual(qn: QueryCacheNotifyEvent): boolean {
    const [_, queryMonth] = qn.query.queryKey;
    const targetMonth = qn.query.meta?.['month'];
    return queryMonth === targetMonth;
  }

  dispatch(qn: QueryCacheNotifyEvent) {
    const type = qn.type;
    const key = qn.query.queryKey;
    switch (type) {
      case 'added': {
        const [_, queryMonth] = qn.query.queryKey;
        this.socketService.joinTodoListRoom(queryMonth);
        const eventSubs = this.subscribeSocketEvents(key, qn);
        const reconnectSub = this.socketService.getReconnectEvent().subscribe({
          next: () => {
            this.unsubscribeSocketEvents();
            this.subs = this.subscribeSocketEvents(key, qn);
          },
        });

        this.subs = [...eventSubs, reconnectSub];
        break;
      }
      case 'removed': {
        this.socketService.leaveTodoListRoom(key[1]);
        this.unsubscribeSocketEvents();
      }
    }
  }

  private subscribeSocketEvents(
    key: string[],
    qn: QueryCacheNotifyEvent,
  ): Subscription[] {
    const { month: metaMonth } = qn.query.meta as { month: string };

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

  private unsubscribeSocketEvents(): void {
    this.subs?.forEach((sub) => {
      sub.unsubscribe();
    });
  }
}
