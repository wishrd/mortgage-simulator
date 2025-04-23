import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, input, output } from "@angular/core";
import { Mortgage } from "@core/models/mortgage";
import { MortgagePlanAmortization } from "@core/models/mortgage-plan";

@Component({
  selector: 'app-mortgage-detail-timeline-item',
  templateUrl: './mortgage-detail-timeline-item.component.html',
  standalone: true,
  imports: [CurrencyPipe, DatePipe],
})
export class MortgageDetailTimelineItemComponent {
  mortgage = input.required<Mortgage>();
  amortization = input.required<MortgagePlanAmortization>();

  clicked = output();
}
