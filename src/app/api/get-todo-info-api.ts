import { inject, Injector, runInInjectionContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Todo } from './get-todo-list';
import { delay, Observable } from 'rxjs';
import { env } from '../../env/env';

export function GetTodoInfoApi(injector = inject(Injector)) {
  return runInInjectionContext(injector, () => {
    const httpClient = inject(HttpClient);

    return (id: string): Observable<Todo> => {
      return httpClient
        .get<Todo>(`${env.apiUrl}/todo/${id}`, {})
        .pipe(delay(1000));
    };
  });
}
