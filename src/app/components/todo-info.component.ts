import { Component, inject, Input, Signal } from '@angular/core';
import { MatCard, MatCardModule } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TodoUpdateModalComponent } from './todo-update-modal.component';
import { MatDialog } from '@angular/material/dialog';
import {
  CreateQueryResult,
  injectMutation,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { filter, lastValueFrom, map } from 'rxjs';
import { UpdateTodoApi } from '../api/update-todo-api';
import { TodoInfoCacheHandler } from '../query/todo-info/todo-info-cache-handler.service';
import { QueryKeys } from '../query';
import { toSignal } from '@angular/core/rxjs-interop';
import { ActivatedRoute } from '@angular/router';
import { GetTodoInfoApi } from '../api/get-todo-info-api';
import { Todo } from '../api/todo-api.model';

@Component({
  standalone: true,
  selector: 'todo-info',
  template: `
    @if (todoInfo.isLoading()) {
      <div style="color: green">Loading...</div>
    } @else if (todoInfo.isError()) {
      <div>Failed to load todo info</div>
    } @else if (todoInfo.isSuccess()) {
      <mat-card class="card">
        @if (updateTodoMutation.isPending()) {
          <div style="color: green; margin: auto;">Updating...</div>
        } @else if (updateTodoMutation.isError()) {
          <div>Failed to update todo</div>
        } @else if (
          updateTodoMutation.isSuccess() || updateTodoMutation.isIdle()
        ) {
          <mat-card-header>
            <mat-card-title>{{ todoInfo.data()!.title }}</mat-card-title>
            <mat-card-subtitle>{{ todoInfo.data()!.date }}</mat-card-subtitle>
            <button
              mat-icon-button
              style="margin-left: auto;"
              (click)="openUpdateDialog(todoInfo.data()!)"
            >
              <mat-icon>edit</mat-icon>
            </button>
          </mat-card-header>
          <mat-card-content class="content">
            <p>{{ todoInfo.data()!.content }}</p>
          </mat-card-content>
        }
      </mat-card>
    }
  `,
  styles: [
    `
      :host {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100%;
      }

      .card {
        min-width: 300px;
        height: 600px;
      }

      .content {
        padding-top: 20px;
      }
    `,
  ],
  imports: [MatCardModule, MatIconButton, MatIcon],
})
export class TodoInfoComponent {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly getTodoInfoApi = GetTodoInfoApi();
  private readonly updateTodoApi = UpdateTodoApi();
  private readonly todoInfoCacheHandler = inject(TodoInfoCacheHandler);
  private dialog = inject(MatDialog);

  id: Signal<string | undefined> = toSignal(
    this.activatedRoute.params.pipe(
      filter((params) => !!params['id']),
      map((params) => params['id'] as string),
    ),
  );

  todoInfo: CreateQueryResult<Todo> = injectQuery(() => ({
    queryKey: [QueryKeys.todoInfo, this.id()!],
    queryFn: () => lastValueFrom(this.getTodoInfoApi(this.id()!)),
    enabled: !!this.id(),
  }));

  updateTodoMutation = injectMutation(() => ({
    mutationFn: (todo: Todo) => lastValueFrom(this.updateTodoApi(todo)),
    onSuccess: (todo: Todo) => {
      this.todoInfoCacheHandler.update(['todoInfo', todo.id], todo);
    },
  }));

  openUpdateDialog(todo: Todo) {
    const dialogRef = this.dialog.open(TodoUpdateModalComponent, {
      width: '450px',
      data: todo,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updatedTodo = {
          ...todo,
          ...result,
        };
        this.updateTodoMutation.mutate(updatedTodo);
      }
    });
  }
}
