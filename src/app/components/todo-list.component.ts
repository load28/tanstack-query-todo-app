import { Component, inject, signal, Signal } from '@angular/core';
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
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import {
  MatDatepicker,
  MatDatepickerInput,
  MatDatepickerToggle,
} from '@angular/material/datepicker';
import { MatExpansionModule } from '@angular/material/expansion';
import { CreateTodoApi } from '../api/create-todo-list';

import { QueryKeys } from '../query';
import { TodoFormComponent } from './todo-form.component';

@Component({
  standalone: true,
  selector: 'todo-list',
  template: `
    <mat-expansion-panel [(expanded)]="openStatus">
      <mat-expansion-panel-header>
        <mat-panel-title> Add Todo</mat-panel-title>
      </mat-expansion-panel-header>

      <todo-form
        [label]="'Add'"
        [todo]="todoForm()"
        [months]="months()"
        (submitEvent)="addTodo($event)"
        (cancelEvent)="onCancel()"
      ></todo-form>
    </mat-expansion-panel>

    @if (todoList.isLoading()) {
      <p style="color: green">Loading...</p>
    } @else if (todoList.isError()) {
      <p style="color: red">Error loading todos.</p>
    } @else if (todoList.isSuccess()) {
      <todo-item *ngFor="let todo of todoList.data()" [todo]="todo"></todo-item>
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        flex-direction: column;
        gap: 42px;
      }
    `,
  ],
  imports: [
    NgIf,
    MatProgressSpinner,
    NgForOf,
    TodoItemComponent,
    MatFormFieldModule,
    ReactiveFormsModule,
    MatInput,
    MatButton,
    MatDatepickerToggle,
    MatDatepickerInput,
    MatDatepicker,
    MatExpansionModule,
    TodoFormComponent,
  ],
})
export class TodoListComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly getTodoListApi = GetTodoListApi();
  private readonly createTodoApi = CreateTodoApi();

  openStatus = false;

  months: Signal<string | undefined> = toSignal(
    this.activatedRoute.queryParams.pipe(
      map((params) => params['m'] as string),
    ),
  );

  todoList: CreateQueryResult<Todo[]> = injectQuery(() => ({
    queryKey: [QueryKeys.todoList, this.months()],
    queryFn: () => lastValueFrom(this.getTodoListApi(this.months()!)),
    enabled: !!this.months(),
    meta: {
      month: this.months(),
    },
  }));

  todoForm = signal({ title: '', content: '', date: '' });

  constructor() {}

  addTodo({
    title,
    date,
    content,
  }: {
    title: string;
    content: string;
    date: string;
  }) {
    this.createTodoApi({
      title,
      date,
      content,
      month: this.months()!,
    }).subscribe();

    this.openStatus = false;
  }

  onCancel() {
    this.openStatus = false;
  }
}
