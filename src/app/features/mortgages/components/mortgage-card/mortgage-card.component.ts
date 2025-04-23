import { Component, inject, input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { Mortgage } from '@core/models/mortgage';

@Component({
  selector: 'app-mortgage-card',
  templateUrl: './mortgage-card.component.html',
  imports: [RouterLink, CurrencyPipe],
})
export class MortgageCardComponent {
  router = inject(Router);

  mortgage = input.required<Mortgage>();

  onDetail(event: Event): void {
    let htmlElement: HTMLElement | null = event.target as HTMLElement | null;
    while (htmlElement) {
      if (htmlElement.id === 'edit') {
        return;
      }

      htmlElement = htmlElement.parentElement;
    }

    this.router.navigateByUrl(`/mortgages/${this.mortgage().id}/detail`);
  }
}
