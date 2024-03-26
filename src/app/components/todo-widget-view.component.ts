import {
  Component,
  effect,
  inject,
  Signal,
  ViewChild,
  ViewContainerRef,
} from '@angular/core';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { PanelComponent } from './todo-panel.component';

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
  private readonly activatedRoute = inject(ActivatedRoute);

  months: Signal<string | undefined> = toSignal(
    this.activatedRoute.queryParams.pipe(
      map((params) => params['m'] as string),
    ),
  );

  @ViewChild('panelContainer', { read: ViewContainerRef })
  container: ViewContainerRef | undefined;

  constructor() {
    effect(
      () => {
        this.addPanel(this.months()!);
      },
      { allowSignalWrites: true },
    );
  }

  addPanel(month: string) {
    const compRef = this.container!.createComponent(PanelComponent);
    compRef.instance.months.set(month);
    compRef.instance.close
      .pipe(takeUntilDestroyed(compRef.instance.destroyRef))
      .subscribe(() => {
        compRef.destroy();
      });
  }
}
