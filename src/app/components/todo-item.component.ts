import { Component, input, OnInit } from '@angular/core';
import { Todo } from '../api/get-todo-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DatePipe } from '@angular/common';
import { TimezoneDatePipe } from '../utils/timezone-date.pipe';
import { DeleteTodoApi } from '../api/delete-todo';

@Component({
  standalone: true,
  selector: 'todo-item',
  template: `
    <mat-card class="todo-card">
      <mat-card-header class="mat-card-header">
        <mat-card-title class="mat-card-title"
          >{{ todo().title }}
        </mat-card-title>
        <mat-card-subtitle class="mat-card-subtitle"
          >{{ todo().date | timezoneDate: 'shortDate' : timezone }}
        </mat-card-subtitle>
        <button
          class="mat-delete-button"
          mat-icon-button
          (click)="onDelete(todo().id)"
        >
          <mat-icon>delete</mat-icon>
        </button>
      </mat-card-header>
      <mat-card-content>
        <p>{{ todo().content }}</p>
      </mat-card-content>
    </mat-card>
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
      color: #e33030;
    }
  `,
  imports: [MatCardModule, MatIconButton, MatIcon, DatePipe, TimezoneDatePipe],
})
export class TodoItemComponent implements OnInit {
  private readonly deleteTodoApi = DeleteTodoApi();
  todo = input.required<Todo>();
  timezone = 'Asia/Seoul';

  constructor() {}

  ngOnInit() {}

  onDelete(id: string) {
    this.deleteTodoApi(id).subscribe();
  }
}
