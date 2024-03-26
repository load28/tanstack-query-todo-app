import {
  Component,
  ComponentFactoryResolver,
  effect,
  inject,
  OnInit,
  signal,
  Signal,
  ViewChild,
  ViewContainerRef,
  WritableSignal,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { lastValueFrom, map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { TodoItemComponent } from './todo-item.component';
import {
  CreateQueryResult,
  injectQuery,
} from '@tanstack/angular-query-experimental';
import { GetTodoListApi, Todo } from '../api/get-todo-list';
import { QueryKeys } from '../app.config';
import { NgForOf } from '@angular/common';
import { MatCard } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'todo-widget-view-component',
  template: `
    <div style="width: 100%; height: 100%" class="example-boundary">
      <ng-container #panelContainer></ng-container>
    </div>
  `,
  imports: [CdkDropList],
})
export class TodoWidgetViewComponent {
  private readonly activatedRoute = inject(ActivatedRoute);

  months: Signal<string | undefined> = toSignal(
    this.activatedRoute.queryParams.pipe(
      map((params) => params['m'] as string),
    ),
  );

  @ViewChild('panelContainer', { read: ViewContainerRef })
  container: ViewContainerRef | undefined;

  constructor() {
    effect(
      () => {
        this.addPanel(this.months()!);
      },
      { allowSignalWrites: true },
    );
  }

  addPanel(month: string) {
    const componentRef = this.container?.createComponent(PanelComponent);
    componentRef!.instance.months.set(month);
  }
}

@Component({
  standalone: true,
  selector: 'panel-component',
  template: `
    <div cdkDrag cdkDragBoundary=".example-boundary">
      @if (todoList.isLoading()) {
      } @else if (todoList.isError()) {
        <p>Error loading todos.</p>
      } @else if (todoList.isSuccess()) {
        <todo-item
          *ngFor="let todo of todoList.data()"
          [todo]="todo"
        ></todo-item>
      }
    </div>
  `,
  styles: [
    `
      div {
        width: 300px;
        height: 300px;
        padding: 10px;
      }
    `,
  ],
  imports: [CdkDrag, TodoItemComponent, NgForOf, MatCard],
})
export class PanelComponent implements OnInit {
  private readonly getTodoListApi = GetTodoListApi();

  months: WritableSignal<string | undefined> = signal(undefined);

  todoList: CreateQueryResult<Todo[]> = injectQuery(() => ({
    queryKey: [QueryKeys.todoList, this.months()],
    queryFn: () => lastValueFrom(this.getTodoListApi(this.months()!)),
    enabled: !!this.months(),
    meta: {
      month: this.months(),
    },
  }));

  constructor() {}

  ngOnInit(): void {}
}
