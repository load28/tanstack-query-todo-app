import { Component, inject, OnInit } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListItem, MatNavList } from '@angular/material/list';
import { NgForOf } from '@angular/common';

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
    `,
  ],
  imports: [RouterOutlet, MatNavList, MatListItem, NgForOf, MatSidenavModule],
})
export class TodoPageComponent implements OnInit {
  private readonly router = inject(Router);
  months: { name: string; value: string }[] = [
    { name: 'January', value: '1' },
    { name: 'February', value: '2' },
    { name: 'March', value: '3' },
    { name: 'April', value: '4' },
    { name: 'May', value: '5' },
    { name: 'June', value: '6' },
    { name: 'July', value: '7' },
    { name: 'August', value: '8' },
    { name: 'September', value: '9' },
    { name: 'October', value: '10' },
    { name: 'November', value: '11' },
    { name: 'December', value: '12' },
  ];

  constructor() {}

  ngOnInit() {}

  async onClick(month: string) {
    await this.router.navigateByUrl(`/todos/list?m=${month}`);
  }
}
