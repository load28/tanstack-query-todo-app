import { HttpClient } from '@angular/common/http';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { env } from '../../env/env';

import { Todo } from './todo-api.model';

export function UpdateTodoApi(injector = inject(Injector)) {
  return runInInjectionContext(injector, () => {
    const httpClient = inject(HttpClient);

    return (todo: Todo): Observable<Todo> => {
      return httpClient.post<Todo>(`${env.apiUrl}/todo/update`, todo).pipe(delay(1000));
    };
  });
}
