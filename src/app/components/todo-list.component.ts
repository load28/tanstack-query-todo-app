import { Component, computed, effect, inject, Signal } from '@angular/core';
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
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
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

@Component({
  standalone: true,
  selector: 'todo-list',
  template: `
    <mat-expansion-panel>
      <mat-expansion-panel-header>
        <mat-panel-title> Add Todo</mat-panel-title>
      </mat-expansion-panel-header>

      <form [formGroup]="todoForm" (ngSubmit)="addTodo()">
        <mat-form-field class="todo-input">
          <mat-label>Title</mat-label>
          <input matInput formControlName="title" />
        </mat-form-field>

        <mat-form-field class="todo-input">
          <mat-label>Details</mat-label>
          <textarea matInput formControlName="details"></textarea>
        </mat-form-field>

        <mat-form-field class="todo-input">
          <mat-label>Due Date</mat-label>
          <input
            matInput
            [matDatepicker]="picker"
            formControlName="date"
            [matDatepickerFilter]="dateFilter()"
          />
          <mat-datepicker-toggle
            matSuffix
            [for]="picker"
          ></mat-datepicker-toggle>
          <mat-datepicker
            #picker
            [startAt]="calendarStartAt()"
          ></mat-datepicker>
        </mat-form-field>

        <button mat-raised-button color="primary" type="submit">Add</button>
      </form>
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

      .todo-input {
        width: 100%;
        margin-bottom: 20px;
      }

      .todo-input textarea {
        height: 140px;
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
  ],
})
export class TodoListComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly getTodoListApi = GetTodoListApi();
  private readonly createTodoApi = CreateTodoApi();

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

  todoForm = new FormGroup({
    title: new FormControl(''),
    details: new FormControl(''),
    date: new FormControl(''),
  });

  dateFilter = computed(() => {
    return (date: Date | null): boolean => {
      if (!this.months()) {
        return false;
      }

      return date ? date.getMonth().toString() === this.months()! : false;
    };
  });

  calendarStartAt = computed(() => {
    return new Date(new Date().getFullYear(), parseInt(this.months()!));
  });

  constructor() {
    effect(() => {
      if (this.months()) {
        this.todoForm.reset();
      }
    });
  }

  addTodo() {
    const newTodo = this.todoForm.value;

    this.createTodoApi({
      title: newTodo.title!,
      content: newTodo.details!,
      date: newTodo.date!,
      month: this.months()!,
    }).subscribe();

    this.todoForm.reset();
  }
}
