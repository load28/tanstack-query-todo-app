import { Routes } from '@angular/router';
import { TodoAddComponent } from './components/todo-add.component';
import { TodoInfoComponent } from './components/todo-info.component';
import { TodoItemComponent } from './components/todo-item.component';
import { TodoListComponent } from './components/todo-list.component';
import { TodoPageComponent } from './components/todo-page.component';
import { TodoWidgetViewComponent } from './components/todo-widget-view.component';
import { UserSettingsPageComponent } from './components/user-settings-page.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/todos/list?m=0',
    pathMatch: 'full',
  },
  {
    path: 'todos',
    component: TodoPageComponent,
    children: [
      {
        path: 'list',
        component: TodoListComponent,
      },
      {
        path: 'add',
        component: TodoAddComponent,
      },
      {
        path: 'item',
        component: TodoItemComponent,
      },
      {
        path: 'widget',
        component: TodoWidgetViewComponent,
      },
    ],
  },
  {
    path: 'todo/:id',
    component: TodoInfoComponent,
  },
  {
    path: 'users/:id',
    component: UserSettingsPageComponent,
  },
  {
    path: '**',
    redirectTo: '/todos',
  },
];
