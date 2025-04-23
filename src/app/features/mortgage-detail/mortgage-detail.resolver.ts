import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { Mortgage } from '@core/models/mortgage';
import { MortgageDataService } from '@core/services/mortgage.data-service';

export const mortgageDetailResolver: ResolveFn<Mortgage | null> = async ({ params }) => {
  const mortgageId = params['id'] as string;
  if (!mortgageId) {
    throw new Error('Missing "id" URL parameter');
  }

  const mortgage = await inject(MortgageDataService).get(mortgageId);
  if (!mortgage) {
    throw new Error('Mortgage not found!');
  }

  return mortgage;
};
