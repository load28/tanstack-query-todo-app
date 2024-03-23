import { Component, input, OnInit } from '@angular/core';
import { Todo } from '../api/get-todo-list';
import { MatCardModule } from '@angular/material/card';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

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
          >{{ todo().date }}
        </mat-card-subtitle>
        <button mat-icon-button>
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
  `,
  imports: [MatCardModule, MatIconButton, MatIcon],
})
export class TodoItemComponent implements OnInit {
  todo = input.required<Todo>();

  constructor() {}

  ngOnInit() {}
}
