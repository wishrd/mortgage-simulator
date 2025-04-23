export interface MortgageAmortization {
  date: string;
  amount: number;
}

export interface MortgageAmortizationConfiguration {
  from: number;
  to: number;
  step: number;
  amount: number;
}

export type MortgageSystem = 'french';
export type MortgageInterval = 'monthly';
export type MortgageInterestType = 'fixed';

export interface Mortgage {
  id: string;
  name: string;
  system: 'french';
  interval: 'monthly';
  interestType: MortgageInterestType;
  baseInterest: number;
  amount: number;
  currency: string;
  quotes: number;
  startDate: string;
  amortizations: MortgageAmortization[];
  amortizationConfigurations: MortgageAmortizationConfiguration[];
}
