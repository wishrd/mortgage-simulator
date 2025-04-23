import { CurrencyPipe, NgTemplateOutlet } from "@angular/common";
import { Component, input, TemplateRef } from "@angular/core";

@Component({
  selector: 'app-mortgage-detail-range',
  templateUrl: './mortgage-detail-range.component.html',
  standalone: true,
  imports: [NgTemplateOutlet],
})
export class MortgageDetailRangeComponent {
  label = input.required<string>();
  main = input.required<number>();
  left = input.required<number>();
  right = input.required<number>();
  highlight = input<boolean>(false);
  template = input<TemplateRef<unknown>>();
}
