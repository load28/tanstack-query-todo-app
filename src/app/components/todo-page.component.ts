import { Component, inject, OnInit, Signal } from '@angular/core';
import { ActivatedRoute, Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { NgClass, NgForOf } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';

@Component({
  standalone: true,
  selector: 'todo-page',
  template: `
    <mat-sidenav-container class="sidenav-container">
      <mat-sidenav #sidenav class="sidenav" mode="side" opened="true">
        <mat-nav-list>
          <h3 class="nav-list-title">Months</h3>
          <a
            mat-list-item
            [ngClass]="{ selected: month.value === selectedMonth() }"
            *ngFor="let month of months"
            (click)="onClick(month.value)"
            >{{ month.name }}</a
          >
        </mat-nav-list>
      </mat-sidenav>
      <mat-sidenav-content class="content">
        <router-outlet></router-outlet>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [
    `
      .sidenav-container {
        height: 100%;
      }

      .sidenav {
        width: 250px;
      }

      .nav-list-title {
        margin-left: 10px;
      }

      .content {
        padding: 20px;
      }

      .selected {
        background-color: #ddd;
      }
    `,
  ],
  imports: [
    RouterOutlet,
    MatNavList,
    MatListItem,
    NgForOf,
    MatSidenavModule,
    NgClass,
  ],
})
export class TodoPageComponent implements OnInit {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  months: { name: string; value: string }[] = [
    { name: 'January', value: '0' },
    { name: 'February', value: '1' },
    { name: 'March', value: '2' },
    { name: 'April', value: '3' },
    { name: 'May', value: '4' },
    { name: 'June', value: '5' },
    { name: 'July', value: '6' },
    { name: 'August', value: '7' },
    { name: 'September', value: '8' },
    { name: 'October', value: '9' },
    { name: 'November', value: '10' },
    { name: 'December', value: '11' },
  ];

  selectedMonth: Signal<string | undefined> = toSignal(
    this.activatedRoute.queryParams.pipe(
      map((params) => params['m'] as string),
    ),
  );

  constructor() {}

  ngOnInit() {}

  async onClick(month: string) {
    await this.router.navigateByUrl(`/todos/list?m=${month}`);
  }
}
