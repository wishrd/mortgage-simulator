import { CurrencyPipe, DatePipe } from "@angular/common";
import { Component, effect, inject, input, output, signal } from "@angular/core";
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

  onSave = output<{ index: number | null, value: MortgageAmortizationConfiguration }>();
  onDelete = output<number>();

  editing = signal(false);
  index = signal<number | null>(null); 
  form!: FormGroup;

  constructor() {
    effect(() => {
      const idx = this.index();
      this.form = this.buildForm(idx === null ? undefined : this.configurations()[idx]);
    });
  }

  clear(): void {
    this.editing.set(false);
    this.index.set(null);
  }

  protected onCancel(): void {
    this.clear();
  }

  protected onEdit(idx: number): void {
    this.index.set(idx);
    this.editing.set(true);
  }

  protected remove(): void {
    const idx = this.index();
    if (idx === null) {
      return;
    }

    this.onDelete.emit(idx);
  }

  protected onSubmit(): void {
    if (!this.form.valid) {
      return;
    }

    let index = this.index();
    if (index !== null && !this.configurations()[index]) {
      index = null;
    }

    this.onSave.emit({
      index,
      value: {
        startDate: this.form.value.startDate!,
        endDate: this.form.value.endDate!,
        periodStep: this.form.value.periodStep!,
        amount: this.form.value.amount!,
      }
    });
  }

  private buildForm(configuration?: MortgageAmortizationConfiguration): FormGroup {
    return this.formBuilder.group({
      startDate: new FormControl(configuration?.startDate || '', [Validators.required]),
      endDate: new FormControl(configuration?.endDate || '', [Validators.required]),
      amount: new FormControl(configuration?.amount || 0, [Validators.required]),
      periodStep: new FormControl(configuration?.periodStep || 1, [Validators.required, Validators.min(1)]),
    });
  }
}
