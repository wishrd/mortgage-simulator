import { Mortgage } from '@core/models/mortgage';

import { inject, Injectable } from '@angular/core';
import { OptionalId } from '@core/models/optional-id';

import { MortgageData } from '../storage/models/mortgage-data';
import { MortgageAmortizationAdapter } from './mortgage-amortization.adapter';

@Injectable({ providedIn: 'root' })
export class MortgageAdapter {

  private readonly amoritizationAdapter = inject(MortgageAmortizationAdapter);

  to(data: MortgageData): Mortgage {
    const id = data.id;
    if (!id) {
      throw new Error('Cannot create a Package without id');
    }

    return { ...data, id };
  }

  from(mortgage: OptionalId<Mortgage>): MortgageData {
    return {
      id: mortgage.id,
      name: mortgage.name,
      system: mortgage.system,
      interval: mortgage.interval,
      interestType: mortgage.interestType,
      baseInterest: mortgage.baseInterest,
      amount: mortgage.amount,
      currency: mortgage.currency,
      quotes: mortgage.quotes,
      startDate: mortgage.startDate,
      amortizations: mortgage.amortizations.map(a => this.amoritizationAdapter.to(a)),
      amortizationConfigurations: mortgage.amortizationConfigurations,
    };
  }
}
