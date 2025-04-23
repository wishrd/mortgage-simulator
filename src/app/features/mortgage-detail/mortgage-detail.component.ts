import { Component, effect, ElementRef, inject, resource, signal, ViewChild } from '@angular/core';
import { injectData } from '@core/signals/inject-data';
import { Mortgage, MortgageAmortization } from '@core/models/mortgage';
import { MortgagePlanService } from '@core/services/mortgage-plan.service';
import { CurrencyPipe } from '@angular/common';
import { MortgageDetailRangeComponent } from "./components/mortgage-detail-range.component";
import { MortgageDetailTimelineItemComponent } from "./components/mortgage-detail-timeline-item.component";
import { MortgagePlanAmortization } from '@core/models/mortgage-plan';
import { MortgageDataService } from '@core/services/mortgage.data-service';
import { MortgageDetailAddAmortizationFormComponent } from "./components/mortgage-detail-add-amortization-form.component";
import { HasAmortizationPipe } from './pipes/has-amortization';

@Component({
  selector: 'app-mortgage-detail',
  templateUrl: './mortgage-detail.component.html',
  imports: [CurrencyPipe, MortgageDetailRangeComponent, MortgageDetailTimelineItemComponent, MortgageDetailAddAmortizationFormComponent, HasAmortizationPipe],
})
export class MortgageDetailComponent {
  @ViewChild('addPartialAmortizationDialog') private readonly addPartialAmortizationDialog!: ElementRef<HTMLDialogElement>;

  private readonly mortgagePlanService = inject(MortgagePlanService);
  private readonly mortgageDataService = inject(MortgageDataService);

  mortgageDetail = injectData<Mortgage>('mortgage');
  mortgage = signal(this.mortgageDetail());
  plan = resource({
    request: () => ({ mortgage: this.mortgage() }),
    loader: ({ request }) => this.mortgagePlanService.get(request.mortgage),
  });

  selectedAmortization = signal<MortgageAmortization | undefined>(undefined);

  constructor() {
    effect(() => this.mortgage.set(this.mortgageDetail()));
  }

  openAddPartialAmortizationForm(amortization: MortgagePlanAmortization): void {
    const mortgage = this.mortgage();
    const amortizations = mortgage.amortizations.map(a => ({ ...a }));
    const existingAmortization = amortizations.find(a => a.date === amortization.date);
    this.selectedAmortization.set(existingAmortization || { date: amortization.date, amount: 0 });
    this.addPartialAmortizationDialog.nativeElement.showModal();
  }

  async onSavePartialAmortization(selectedAmortization: MortgageAmortization, partialAmortization: MortgageAmortization): Promise<void> {
    const mortgage = this.mortgage();
    const amortizations = mortgage.amortizations.filter(a => a.date !== selectedAmortization.date).map(a => ({ ...a }));
    amortizations.push(partialAmortization);
    const updatedMortgage = { ...mortgage, amortizations };
    this.mortgagePlanService.remove(updatedMortgage);
    await this.mortgageDataService.save(updatedMortgage);
    this.mortgage.set(updatedMortgage);
    this.addPartialAmortizationDialog.nativeElement.close();
  }

  async onDeletePartialAmortization(selectedAmortization: MortgageAmortization): Promise<void> {
    const mortgage = this.mortgage();
    const amortizations = mortgage.amortizations.filter(a => a.date !== selectedAmortization.date).map(a => ({ ...a }));
    const updatedMortgage = { ...mortgage, amortizations };
    this.mortgagePlanService.remove(updatedMortgage);
    await this.mortgageDataService.save(updatedMortgage);
    this.mortgage.set(updatedMortgage);
    this.addPartialAmortizationDialog.nativeElement.close();
  }
}
