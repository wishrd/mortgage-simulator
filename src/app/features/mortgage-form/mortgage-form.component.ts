import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Mortgage, MortgageInterestType, MortgageInterval, MortgageSystem } from '@core/models/mortgage';
import { MortgageDataService } from '@core/services/mortgage.data-service';
import { injectData } from '@core/signals/inject-data';

@Component({
  selector: 'app-mortgage-form',
  templateUrl: './mortgage-form.component.html',
  imports: [RouterLink, ReactiveFormsModule],
})
export class MortgageFormComponent {
  private readonly router = inject(Router);
  private readonly formBuilder = inject(FormBuilder);
  private readonly mortgageDataService = inject(MortgageDataService);

  mortgage = injectData<Mortgage | null>('mortgage');

  mortgageForm = this.formBuilder.group({
    name: new FormControl<string>(this.mortgage()?.name || '', [Validators.required]),
    system: new FormControl<MortgageSystem>(this.mortgage()?.system || 'french', [Validators.required]),
    interval: new FormControl<MortgageInterval>(this.mortgage()?.interval || 'monthly', [Validators.required]),
    interestType: new FormControl<MortgageInterestType>(this.mortgage()?.interestType || 'fixed', [Validators.required]),
    baseInterest: new FormControl<number>(this.mortgage()?.baseInterest || 0, [Validators.required, Validators.min(0)]),
    amount: new FormControl<number>(this.mortgage()?.amount || 0, [Validators.required, Validators.min(0)]),
    currency: new FormControl<string>(this.mortgage()?.currency || 'EUR', [Validators.required]),
    quotes: new FormControl<number>(this.mortgage()?.quotes || 0, [Validators.required, Validators.min(0)]),
    startDate: new FormControl<string>(this.mortgage()?.startDate || new Date().toLocaleDateString(), [Validators.required, Validators.min(0)]),
  });

  async onSubmit(): Promise<void> {
    if (!this.mortgageForm.valid) {
      throw new Error('Mortgage form is not valid');
    }

    await this.mortgageDataService.save({
      id: this.mortgage()?.id,
      name: this.mortgageForm.value.name!,
      system: this.mortgageForm.value.system!,
      interestType: this.mortgageForm.value.interestType!,
      interval: this.mortgageForm.value.interval!,
      quotes: this.mortgageForm.value.quotes!,
      baseInterest: this.mortgageForm.value.baseInterest!,
      startDate: this.mortgageForm.value.startDate!,
      amount: this.mortgageForm.value.amount!,
      currency: this.mortgageForm.value.currency!,
      amortizations: [],
      amortizationConfigurations: [],
    });

    this.router.navigateByUrl('/mortgages');
  }

  async onDelete(): Promise<void> {
    const mortgageId = this.mortgage()?.id;
    if (!mortgageId) {
      throw new Error('Package not found');
    }

    await this.mortgageDataService.delete(mortgageId);
    this.router.navigateByUrl('/packages');
  }
}
