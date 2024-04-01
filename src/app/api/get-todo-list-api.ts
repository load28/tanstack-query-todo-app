import { HttpClient } from '@angular/common/http';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { delay, Observable } from 'rxjs';
import { env } from '../../env/env';
import { Todo } from './todo-api.model';

export function GetTodoListApi(injector = inject(Injector)) {
  return runInInjectionContext(injector, () => {
    const httpClient = inject(HttpClient);

    return (month: string): Observable<Todo[]> => {
      return httpClient.get<Todo[]>(`${env.apiUrl}/todo/list/${month}`).pipe(
        delay(1000),
        // switchMap(() => {
        //   throw Error('Not implemented');
        // }),
      );
    };
  });
}
