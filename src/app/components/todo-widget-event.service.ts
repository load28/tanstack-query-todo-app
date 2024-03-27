import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoWidgetEventService {
  private event$ = new Subject<string>();

  nextEvent(month: string) {
    this.event$.next(month);
  }

  getEvent$() {
    return this.event$.asObservable();
  }
}
