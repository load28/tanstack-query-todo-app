import { inject, Injector, runInInjectionContext } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { env } from '../../env/env';
import { Observable } from 'rxjs';

export interface Todo {
  id: string;
  title: string;
  content: string;
  date: string;
  month: string;
}

export function GetTodoListApi(injector = inject(Injector)) {
  return runInInjectionContext(injector, () => {
    const httpClient = inject(HttpClient);

    return (month: string): Observable<Todo[]> => {
      return httpClient
        .get<Todo[]>(`${env.apiUrl}/todo/list/${month}`)
        .pipe
        // switchMap(() => {
        //   throw Error('Not implemented');
        // }),
        ();
    };
  });
}
