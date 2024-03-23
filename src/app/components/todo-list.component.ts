import { Component, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'todo-list',
  template: `{{ metaInfo() }}`,
})
export class TodoListComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);

  metaInfo: Signal<string | undefined> = toSignal(
    this.activatedRoute.queryParams.pipe(
      map((params) => params['m'] as string),
    ),
  );

  constructor() {}

  ngOnInit() {}
}
