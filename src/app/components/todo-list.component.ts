import { Component, inject, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { lastValueFrom, map } from 'rxjs';
import {
  CreateQueryResult,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { GetTodoListApi, Todo } from '../api/get-todo-list';
import { NgForOf, NgIf } from '@angular/common';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { TodoItemComponent } from './todo-item.component';
import { SocketService } from '../socket.service';

@Component({
  standalone: true,
  selector: 'todo-list',
  template: `
    @if (todoList.isLoading()) {
      <!--      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>-->
    } @else if (todoList.isError()) {
      <p>Error loading todos.</p>
    } @else if (todoList.isSuccess()) {
      <todo-item *ngFor="let todo of todoList.data()" [todo]="todo"></todo-item>
    }
  `,
  imports: [NgIf, MatProgressSpinner, NgForOf, TodoItemComponent],
})
export class TodoListComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly socketService = inject(SocketService);
  private readonly getTodoListApi = GetTodoListApi();

  months: Signal<number | undefined> = toSignal(
    this.activatedRoute.queryParams.pipe(
      map((params) => params['m'] as number),
    ),
  );

  todoList: CreateQueryResult<Todo[]> = injectQuery(() => ({
    queryKey: ['todoList', this.months()],
    queryFn: () => lastValueFrom(this.getTodoListApi(this.months()!)),
    enabled: !!this.months(),
    meta: { month: this.months() },
  }));
}
