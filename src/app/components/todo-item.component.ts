import { Component, OnInit } from '@angular/core';

@Component({
  standalone: true,
  selector: 'todo-item',
  template: ` <div>todo item</div> `,
})
export class TodoItemComponent implements OnInit {
  constructor() {}

  ngOnInit() {}
}
