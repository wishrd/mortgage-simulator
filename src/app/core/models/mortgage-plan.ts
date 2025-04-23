export interface MortgagePlanAmortization {
  quantity: number;
  quotaQuantity: number;
  date: string;
  quota: number;
  interestQuantity: number;
  totalQuotaAmortizationQuantity: number;
  interest: number;
  partialAmortizationsQuantity: number;
  passed: boolean;
}

export interface MortgagePlanResults {
  quotas: number;
  currentQuota: number;
  totalWithInterests: number;
  currentTotalInterests: number;
  totalInterests: number;
  currentTotalAmortization: number;
}

export interface MortgagePlan {
  currentQuota: number;
  amortizations: Array<MortgagePlanAmortization>;
  results: MortgagePlanResults;
}
