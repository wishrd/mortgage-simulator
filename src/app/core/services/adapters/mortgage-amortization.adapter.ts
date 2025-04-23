import { MortgageAmortization } from '@core/models/mortgage';


import { Injectable } from '@angular/core';

import { MortgageAmortizationData } from '../storage/models/mortgage-data';

@Injectable({ providedIn: 'root' })
export class MortgageAmortizationAdapter {

  to(data: MortgageAmortizationData): MortgageAmortization {
    return {
      amount: data.amount,
      date: data.date,
    }
  }

  from(amortization: MortgageAmortization): MortgageAmortizationData {
    return {
      amount: amortization.amount,
      date: amortization.date,
    };
  }
}
