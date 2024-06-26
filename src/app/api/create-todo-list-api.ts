import { HttpClient } from '@angular/common/http';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../env/env';

import { Todo } from './todo-api.model';

export function CreateTodoApi(injector = inject(Injector)) {
  return runInInjectionContext(injector, () => {
    const httpClient = inject(HttpClient);

    return (todo: Omit<Todo, 'id'>): Observable<Todo> => {
      return httpClient.post<Todo>(`${env.apiUrl}/todo/create`, todo);
    };
  });
}
