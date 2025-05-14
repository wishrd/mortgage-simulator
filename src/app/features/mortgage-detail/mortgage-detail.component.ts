import { Component, effect, ElementRef, inject, resource, signal, ViewChild } from '@angular/core';
import { formatDate } from 'date-fns';
import { injectData } from '@core/signals/inject-data';
import { Mortgage, MortgageAmortization, MortgageAmortizationConfiguration } from '@core/models/mortgage';
import { MortgagePlanService } from '@core/services/mortgage-plan.service';
import { CurrencyPipe } from '@angular/common';
import { MortgageDetailRangeComponent } from "./components/mortgage-detail-range.component";
import { MortgageDetailTimelineItemComponent } from "./components/mortgage-detail-timeline-item.component";
import { MortgagePlanAmortization } from '@core/models/mortgage-plan';
import { MortgageDataService } from '@core/services/mortgage.data-service';
import { MortgageDetailAddAmortizationFormComponent } from "./components/mortgage-detail-add-amortization-form.component";
import { HasAmortizationPipe } from './pipes/has-amortization';
import { MortgageDetailAmortizationConfigurationsFormComponent } from './components/mortgage-detail-amortization-configurations-form.component';

@Component({
  selector: 'app-mortgage-detail',
  templateUrl: './mortgage-detail.component.html',
  imports: [CurrencyPipe, MortgageDetailRangeComponent, MortgageDetailTimelineItemComponent, MortgageDetailAddAmortizationFormComponent, MortgageDetailAmortizationConfigurationsFormComponent, HasAmortizationPipe],
})
export class MortgageDetailComponent {
  @ViewChild('addPartialAmortizationDialog') private readonly addPartialAmortizationDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('amortizationConfigurationsDialog') private readonly amortizationConfigurationsDialog!: ElementRef<HTMLDialogElement>;
  @ViewChild('amortizationConfigurationsForm') private readonly amortizationConfigurationsForm!: MortgageDetailAmortizationConfigurationsFormComponent;

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

  openAddPartialAmortizationForm(amortization?: MortgagePlanAmortization): void {
    const date = new Date();
    const startDate = new Date(this.mortgage().startDate);
    date.setDate(startDate.getDate());
    const dateStr = formatDate(date, 'yyyy-MM-dd');
    console.log(dateStr);

    const mortgage = this.mortgage();
    const amortizations = mortgage.amortizations.map(a => ({ ...a }));
    const existingAmortization = amortization
      ? (amortizations.find(a => a.date === amortization.date) || { date: amortization.date, amount: 0 })
      : (amortizations.find(a => a.date === dateStr) || { date: this.getDefaultAmortizationDate(dateStr), amount: 0 });
    this.selectedAmortization.set(existingAmortization);
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

  openAmortizationConfigurationsForm(): void {
    this.amortizationConfigurationsForm.clear();
    this.amortizationConfigurationsDialog.nativeElement.showModal();
  }

  async onSaveAmortizationConfiguration(configuration: { index: number | null, value: MortgageAmortizationConfiguration }): Promise<void> {
    const mortgage = this.mortgage();
    const amortizationConfigurations = configuration.index === null
      ? mortgage.amortizationConfigurations.concat(configuration.value)
      : mortgage.amortizationConfigurations.map((value, index) => index === configuration.index ? configuration.value : value);
    const updatedMortgage = { ...mortgage, amortizationConfigurations };
    this.mortgagePlanService.remove(updatedMortgage);
    await this.mortgageDataService.save(updatedMortgage);
    this.mortgage.set(updatedMortgage);
    this.amortizationConfigurationsDialog.nativeElement.close();
  }

  async onDeleteAmortizationConfiguration(index: number): Promise<void> {
    const mortgage = this.mortgage();
    const amortizationConfigurations = mortgage.amortizationConfigurations.filter((_, i) => i !== index);
    const updatedMortgage = { ...mortgage, amortizationConfigurations };
    this.mortgagePlanService.remove(updatedMortgage);
    await this.mortgageDataService.save(updatedMortgage);
    this.mortgage.set(updatedMortgage);
    this.amortizationConfigurationsDialog.nativeElement.close();
  }

  private getDefaultAmortizationDate(date: string): string {
    return this.mortgage().amortizations.find((value) => value.date === date)?.date
      || date;
  }
}
