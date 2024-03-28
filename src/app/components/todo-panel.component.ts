import {
  Component,
  computed,
  DestroyRef,
  EventEmitter,
  inject,
  OnInit,
  Output,
  signal,
  WritableSignal,
} from '@angular/core';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { TodoItemComponent } from './todo-item.component';
import { NgForOf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatIconButton } from '@angular/material/button';
import { GetTodoListApi } from '../api/get-todo-list-api';
import {
  CreateQueryResult,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { lastValueFrom } from 'rxjs';
import { QueryKeys } from '../query';
import { Todo } from '../api/todo-api.model';

@Component({
  standalone: true,
  selector: 'panel-component',
  template: `
    <div class="container" cdkDrag cdkDragBoundary=".boundary">
      <mat-card class="card">
        <mat-card-header class="header">
          <mat-card-title>{{ monthLabels() }}</mat-card-title>
          <button mat-icon-button class="close-button" (click)="closePanel()">
            <mat-icon>close</mat-icon>
          </button>
        </mat-card-header>
        <mat-card-content class="card-content">
          @if (todoList.isLoading()) {
            <div class="loading">Loading...</div>
          } @else if (todoList.isError()) {
            <p style="color: red">Error loading todos.</p>
          } @else {
            @if (todoList.data()!.length === 0) {
              <div class="empty">No todos</div>
            } @else {
              <todo-item
                *ngFor="let todo of todoList.data()"
                [todo]="todo"
              ></todo-item>
            }
          }
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .container {
        position: absolute;
        top: 0;
        left: 0;
        width: fit-content;
      }

      .loading {
        display: flex;
        justify-content: center;
        align-items: center;
        color: green;
      }

      .card {
        width: 300px;
        overflow: hidden;
      }

      .header {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e0e0e0;
        padding: 0 12px;
        height: 48px;
      }

      .empty {
        text-align: center;
        padding: 8px;
        font-weight: bold;
      }

      .card-content {
        box-sizing: border-box;
        padding: 8px 8px 0;
        max-height: 280px;
        overflow-y: auto;
      }

      .close-button {
        position: absolute;
        right: 0;
        top: 0;
      }
    `,
  ],
  imports: [
    CdkDrag,
    TodoItemComponent,
    NgForOf,
    MatCardModule,
    MatIcon,
    MatIconButton,
  ],
})
export class PanelComponent implements OnInit {
  readonly destroyRef = inject(DestroyRef);
  private readonly getTodoListApi = GetTodoListApi();

  months: WritableSignal<string | undefined> = signal(undefined);
  monthLabels = computed(() => {
    return this.monthsConstant.find((month) => month.value === this.months())
      ?.name;
  });

  monthsConstant: { name: string; value: string }[] = [
    { name: 'January', value: '0' },
    { name: 'February', value: '1' },
    { name: 'March', value: '2' },
    { name: 'April', value: '3' },
    { name: 'May', value: '4' },
    { name: 'June', value: '5' },
    { name: 'July', value: '6' },
    { name: 'August', value: '7' },
    { name: 'September', value: '8' },
    { name: 'October', value: '9' },
    { name: 'November', value: '10' },
    { name: 'December', value: '11' },
  ];

  todoList: CreateQueryResult<Todo[]> = injectQuery(() => ({
    queryKey: [QueryKeys.todoList, this.months()],
    queryFn: () => lastValueFrom(this.getTodoListApi(this.months()!)),
    enabled: !!this.months(),
    meta: {
      month: this.months(),
    },
  }));

  @Output() close = new EventEmitter<void>();

  constructor() {}

  ngOnInit(): void {}

  closePanel() {
    this.close.emit();
  }
}
