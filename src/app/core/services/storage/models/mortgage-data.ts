export interface MortgageAmortizationData {
  date: string;
  amount: number;
}

export interface MortgageAmortizationConfigurationData {
  startDate: string;
  endDate: string;
  periodStep: number;
  amount: number;
}

export interface MortgageData {
  id?: string;
  name: string;
  system: 'french';
  interval: 'monthly';
  interestType: 'fixed';
  baseInterest: number;
  amount: number;
  currency: string;
  quotes: number;
  startDate: string;
  amortizations: MortgageAmortizationData[],
  amortizationConfigurations: MortgageAmortizationConfigurationData[],
}
