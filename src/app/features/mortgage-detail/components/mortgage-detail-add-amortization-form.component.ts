import { Component, effect, inject, input, output } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from "@angular/forms";
import { MortgageAmortization } from "@core/models/mortgage";

@Component({
  selector: 'app-mortgage-detail-add-amortization-form',
  templateUrl: './mortgage-detail-add-amortization-form.component.html',
  standalone: true,
  imports: [ReactiveFormsModule],
})
export class MortgageDetailAddAmortizationFormComponent {
  formBuilder = inject(FormBuilder);

  formId = input.required<string>();
  amortization = input<MortgageAmortization>();

  onSave = output<MortgageAmortization>();

  form!: FormGroup;

  constructor() {
    effect(() => {
      this.form = this.formBuilder.group({
        date: new FormControl(this.amortization()?.date || null, { validators: [Validators.required] }),
        amount: new FormControl(this.amortization()?.amount || 0, { validators: [Validators.required] }),
      });
    });
  }

  onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    this.onSave.emit({
      date: this.form.value.date!,
      amount: this.form.value.amount!,
    });
  }
}
