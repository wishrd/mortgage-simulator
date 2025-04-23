import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Mortgage } from '@core/models/mortgage';
import { MortgageDataService } from '@core/services/mortgage.data-service';

export const mortgagesResolver: ResolveFn<Mortgage[]> = async () => {
  return inject(MortgageDataService).all();
};
