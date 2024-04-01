import { HttpClient } from '@angular/common/http';
import { inject, Injector, runInInjectionContext } from '@angular/core';
import { Observable } from 'rxjs';
import { env } from '../../env/env';

export function DeleteTodoApi(injector = inject(Injector)) {
  return runInInjectionContext(injector, () => {
    const httpClient = inject(HttpClient);

    return (id: string): Observable<void> => {
      return httpClient.post<void>(`${env.apiUrl}/todo/delete`, { id });
    };
  });
}
