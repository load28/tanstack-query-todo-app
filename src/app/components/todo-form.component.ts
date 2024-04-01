import { Component, computed, effect, input, output } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatFormField, MatLabel, MatSuffix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';

@Component({
  standalone: true,
  selector: 'todo-form',
  template: `
    <form [formGroup]="todoForm" (ngSubmit)="onSubmitEvent()">
      <mat-form-field class="todo-input">
        <mat-label>Title</mat-label>
        <input matInput formControlName="title" />
      </mat-form-field>

      <mat-form-field class="todo-input">
        <mat-label>Details</mat-label>
        <textarea matInput formControlName="details"></textarea>
      </mat-form-field>

      <mat-form-field class="todo-input">
        <mat-label>Due Date</mat-label>
        <input matInput [matDatepicker]="picker" formControlName="date" [matDatepickerFilter]="dateFilter()" />
        <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
        <mat-datepicker #picker [startAt]="calendarStartAt()"></mat-datepicker>
      </mat-form-field>

      <div class="btn-group">
        <button mat-raised-button color="secondary" type="button" (click)="onCancel()">Cancel</button>
        <button mat-raised-button color="primary" type="submit">
          {{ label() }}
        </button>
      </div>
    </form>
  `,
  styles: [
    `
      .todo-input {
        width: 100%;
        margin-bottom: 20px;
      }

      .todo-input textarea {
        height: 140px;
      }

      .btn-group {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
      }
    `,
  ],
  imports: [
    FormsModule,
    MatButton,
    MatDatepicker,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatFormField,
    MatInput,
    MatLabel,
    MatSuffix,
    ReactiveFormsModule,
  ],
})
export class TodoFormComponent {
  months = input.required<string | undefined>();
  todo = input.required<{ title: string; content: string; date: string }>();
  label = input.required<string>();
  submitEvent = output<{ title: string; content: string; date: string }>();
  cancelEvent = output<void>();

  todoForm = new FormGroup({
    title: new FormControl(''),
    details: new FormControl(''),
    date: new FormControl(''),
  });

  dateFilter = computed(() => {
    return (date: Date | null): boolean => {
      if (!this.months()) {
        return false;
      }

      return date ? date.getMonth().toString() === this.months()! : false;
    };
  });

  calendarStartAt = computed(() => {
    return new Date(new Date().getFullYear(), parseInt(this.months()!));
  });

  constructor() {
    effect(() => {
      this.todoForm.setValue({
        title: this.todo()!.title,
        details: this.todo()!.content,
        date: this.todo()!.date,
      });
    });
  }

  onCancel() {
    this.todoForm.reset();
    this.cancelEvent.emit();
  }

  onSubmitEvent() {
    const todo: { title: string; content: string; date: string } = {
      title: this.todoForm.value.title!,
      content: this.todoForm.value.details!,
      date: this.todoForm.value.date!,
    };
    this.submitEvent.emit(todo);
    this.todoForm.reset();
  }
}
