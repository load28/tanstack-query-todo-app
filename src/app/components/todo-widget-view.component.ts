import { Component, inject, ViewChild, ViewContainerRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { PanelComponent } from './todo-panel.component';
import { TodoWidgetEventService } from './todo-widget-event.service';

@Component({
  standalone: true,
  selector: 'todo-widget-view-component',
  template: `
    <div class="boundary">
      <ng-container #panelContainer></ng-container>
    </div>
  `,
  styles: [
    `
      .boundary {
        width: 100%;
        height: 100vh;
        position: relative;
      }
    `,
  ],
})
export class TodoWidgetViewComponent {
  private readonly todoWidgetEventService = inject(TodoWidgetEventService);

  @ViewChild('panelContainer', { read: ViewContainerRef })
  container: ViewContainerRef | undefined;

  constructor() {
    this.todoWidgetEventService
      .getEvent$()
      .pipe(
        filter((month) => !!month),
        takeUntilDestroyed(),
      )
      .subscribe({
        next: (month) => this.addPanel(month!),
      });
  }

  private addPanel(month: string) {
    const compRef = this.container!.createComponent(PanelComponent);
    compRef.instance.months.set(month);
    compRef.instance.close.pipe(takeUntilDestroyed(compRef.instance.destroyRef)).subscribe(() => {
      compRef.destroy();
    });
  }
}
