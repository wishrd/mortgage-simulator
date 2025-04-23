/// <reference lib="webworker" />

import { format } from 'date-fns';
import type { Mortgage } from '@core/models/mortgage';
import type { MortgagePlan, MortgagePlanAmortization } from '@core/models/mortgage-plan';


function calculateMortgagePlan(mortgage: Mortgage): MortgagePlan {
  const interestRatio = (mortgage.baseInterest + 0 /** Variable interest */) / 100 / (mortgage.interval === 'monthly' ? 12 : 1);

  const iPowN = Math.pow(1 + interestRatio, mortgage.quotes);
  const quota = ((mortgage.amount * interestRatio * iPowN) / (iPowN - 1));
  const startDate = new Date(mortgage.startDate);

  const currentDate = new Date();
  currentDate.setDate(startDate.getDate());
  currentDate.setHours(0, 0, 0, 0);
  const date = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
  const amortizations: MortgagePlanAmortization[] = [];
  let total = mortgage.amount;
  let totalQuotaInterests = 0;
  let currentTotalInterests = 0;
  let currentQuota = 0;
  let currentTotalAmortization = 0;
  let currentTotalPartialAmortizations = 0;

  let index = 0
  for (; index < mortgage.quotes && total > 0; index++) {
    const quotaNumber = index + 1;
    const quotaInterest = total * interestRatio;
    const dateStr = format(date, 'yyyy-MM-dd');
    let quotaAmortization = quota - quotaInterest;

    let totalPartialAmortizations = 0
    if (date <= currentDate) {
      currentTotalInterests += quotaInterest;
      totalPartialAmortizations = mortgage.amortizations.find(a => a.date === dateStr)?.amount || 0;
      currentQuota = index + 1;
      currentTotalAmortization += quotaAmortization;
      currentTotalPartialAmortizations += totalPartialAmortizations;
    } else {
      totalPartialAmortizations = mortgage.amortizationConfigurations
        .filter(partialAmortization => {
          if (partialAmortization.from === partialAmortization.to) {
            return partialAmortization.from === quotaNumber
          } else if (partialAmortization.from <= quotaNumber && (!partialAmortization.to || partialAmortization.to >= quotaNumber)) {
            return (quotaNumber - partialAmortization.from) % partialAmortization.step === 0
          }

          return false;
        })
        .map(partialAmortization => partialAmortization.amount)
        .reduce((s, partialAmortization) => s + partialAmortization, 0);
    }

    if (total - quotaAmortization <= 0) {
      quotaAmortization = total;
      totalPartialAmortizations = 0;
    }

    if (total - (quotaAmortization + totalPartialAmortizations) <= 0) {
      totalPartialAmortizations = total - quotaAmortization;
    }

    total -= quotaAmortization + totalPartialAmortizations;

    totalQuotaInterests += quotaInterest;

    const amortization = {
      quantity: total,
      date: dateStr,
      quota: quotaNumber,
      quotaQuantity: total === 0 ? quotaAmortization + quotaInterest : quota,
      interest: mortgage.baseInterest + 0 /* Variable interest */,
      interestQuantity: quotaInterest,
      partialAmortizationsQuantity: totalPartialAmortizations,
      totalQuotaAmortizationQuantity: quotaAmortization + totalPartialAmortizations,
      passed: date <= currentDate,
    };

    amortizations.push(amortization);

    if (mortgage.interval === 'monthly') {
      date.setMonth(date.getMonth() + 1);
    } else {
      date.setFullYear(date.getFullYear() + 1);
    }
  }

  const results = {
    quotas: amortizations.length,
    currentQuota: currentQuota,
    currentTotalInterests: currentTotalInterests,
    totalInterests: totalQuotaInterests,
    totalWithInterests: totalQuotaInterests + mortgage.amount,
    currentTotalAmortization: currentTotalAmortization + currentTotalPartialAmortizations,
  };

  return {
    currentQuota,
    amortizations,
    results
  };
}

addEventListener('message', ({ data: mortgage }) => {
  postMessage(calculateMortgagePlan(mortgage));
});
