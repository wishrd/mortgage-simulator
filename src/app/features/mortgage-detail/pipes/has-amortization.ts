import { Pipe, PipeTransform } from "@angular/core";
import { Mortgage } from "@core/models/mortgage";

@Pipe({ name: 'hasAmortization', standalone: true })
export class HasAmortizationPipe implements PipeTransform {

  transform(mortgage: Mortgage, date?: string): boolean {
    if (!date) {
      return false;
    }

    return mortgage.amortizations.some(a => a.date === date);
  }
}
