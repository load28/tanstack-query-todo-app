import { Component, inject, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { TimezoneDatePipe } from '../utils/timezone-date.pipe';
import { DeleteTodoApi } from '../api/delete-todo-api';
import { Router } from '@angular/router';
import { Todo } from '../api/todo-api.model';

@Component({
  standalone: true,
  selector: 'todo-item',
  template: `
    @if (todo) {
      <mat-card class="todo-card">
        <mat-card-header class="mat-card-header">
          <mat-card-title class="mat-card-title"
            >{{ todo.title }}
          </mat-card-title>
          <mat-card-subtitle class="mat-card-subtitle"
            >{{ todo.date | timezoneDate: 'shortDate' : timezone }}
          </mat-card-subtitle>
          <div class="btn-group">
            <button mat-icon-button (click)="moveTodoInfo(todo.id)">
              <mat-icon>edit</mat-icon>
            </button>
            <button
              class="mat-delete-button"
              mat-icon-button
              (click)="onDelete(todo.id)"
            >
              <mat-icon>delete</mat-icon>
            </button>
          </div>
        </mat-card-header>
        <mat-card-content>
          <p>{{ todo.content }}</p>
        </mat-card-content>
      </mat-card>
    }
  `,
  styles: `
    .todo-card {
      width: 100%; /* 최대 너비 */
      min-height: 200px; /* 최소 높이 */
      margin-bottom: 20px;
      display: flex;
      flex-direction: column;
    }

    .mat-card-header {
      justify-content: space-between;
      margin-bottom: 24px;
    }

    .mat-card-title {
      font-size: 18px;
      font-weight: bold;
    }

    .mat-card-subtitle {
      font-size: 14px;
      color: #666666;
    }

    .mat-delete-button {
      color: #ab9e9e;
    }

    .btn-group {
      display: flex;
      gap: 10px;
      margin-left: auto;
    }
  `,
  imports: [MatCardModule, MatIconButton, MatIcon, DatePipe, TimezoneDatePipe],
})
export class TodoItemComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly deleteTodoApi = DeleteTodoApi();

  @Input('todo') todo: Todo | undefined;

  timezone = 'Asia/Seoul';
  ngOnInit() {}

  onDelete(id: string) {
    this.deleteTodoApi(id).subscribe();
  }

  async moveTodoInfo(id: string) {
    await this.router.navigateByUrl(`/todo/${id}`);
  }
}
