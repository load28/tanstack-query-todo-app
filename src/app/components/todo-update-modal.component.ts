import { Component, Inject } from '@angular/core';
import { TodoFormComponent } from './todo-form.component';
import {
  MAT_DIALOG_DATA,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';

@Component({
  standalone: true,
  selector: 'todo-update-modal',
  template: `
    <mat-card>
      <mat-card-header>
        <mat-card-title>Edit Todo</mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <todo-form
          [label]="'Update'"
          [todo]="todoData"
          [months]="month"
          (cancelEvent)="dialogRef.close()"
          (submitEvent)="onSubmit($event)"
        ></todo-form>
      </mat-card-content>
    </mat-card>
  `,
  styles: [
    `
      mat-card-header {
        padding: 20px 16px 20px;
      }
    `,
  ],
  imports: [TodoFormComponent, MatDialogContent, MatCardModule],
})
export class TodoUpdateModalComponent {
  todoData = {
    title: this.data.title,
    content: this.data.content,
    date: this.data.date,
  };
  month = this.data.month;

  constructor(
    public dialogRef: MatDialogRef<TodoUpdateModalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      content: string;
      date: string;
      month: string;
    },
  ) {}

  onSubmit(data: { title: string; content: string; date: string }): void {
    this.dialogRef.close(data);
  }
}
