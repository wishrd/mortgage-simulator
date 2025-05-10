import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, inject, input, output, signal } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { Mortgage, MortgageAmortizationConfiguration } from "@core/models/mortgage";

@Component({
  selector: 'app-mortgage-detail-amortization-configurations-form',
  templateUrl: './mortgage-detail-amortization-configurations-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule, DatePipe, CurrencyPipe],
})
export class MortgageDetailAmortizationConfigurationsFormComponent {
  formBuilder = inject(FormBuilder);

  mortgage = input.required<Mortgage>();
  configurations = input.required<MortgageAmortizationConfiguration[]>();

  onSave = output<MortgageAmortizationConfiguration>();

  editing = signal(false);
  form!: FormGroup;

  constructor() {
    this.form = this.formBuilder.group({
      startDate: new FormControl('', [Validators.required]),
      endDate: new FormControl('', [Validators.required]),
      amount: new FormControl(0, [Validators.required]),
      periodStep: new FormControl(0, [Validators.required]),
    });
  }

  onSubmit(): void {
    console.log(this.form.value);

    if (!this.form.valid) {
      return;
    }

    this.onSave.emit({
      startDate: this.form.value.startDate!,
      endDate: this.form.value.endDate!,
      periodStep: this.form.value.periodStep!,
      amount: this.form.value.amount!,
    });
  }
}
