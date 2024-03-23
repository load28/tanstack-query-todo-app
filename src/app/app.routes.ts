import { Routes } from '@angular/router';
import { TodoPageComponent } from './components/todo-page.component';
import { TodoItemComponent } from './components/todo-item.component';
import { UserSettingsPageComponent } from './components/user-settings-page.component';
import { TodoAddComponent } from './components/todo-add.component';
import { TodoListComponent } from './components/todo-list.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/todos/list',
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
    ],
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
