export enum InstrumentType {
  IPRS = 'IPRS', // Islamic Profit Rate Swap
  CCS = 'CCS',   // Cross Currency Swap
  RangeAccrual = 'RangeAccrual'
}

export enum Currency {
  USD = 'USD',
  SAR = 'SAR', // Saudi Riyal
  AED = 'AED', // UAE Dirham
  MYR = 'MYR'  // Malaysian Ringgit
}

export interface InstrumentParams {
  type: InstrumentType;
  notional: number;
  currency: Currency;
  tenorMonths: number;
  fixedRate: number;
  barrierLevel?: number; // For path dependent
  barrierType?: 'Knock-In' | 'Knock-Out';
  counterparty: string;
}

export interface PricingPath {
  step: number;
  time: string;
  price: number;
  probabilityDensity?: number;
}

export interface PricingResult {
  fairValue: number;
  delta: number;
  gamma: number;
  bidAskSpread: number;
  classicalPrice: number; // Comparison
  quantumPrice: number;   // The better price
  confidence: number;
  paths: PricingPath[][]; // Array of paths for visualization
  optimalPath: PricingPath[];
  structuringNotes: string;
  shariaCompliance: string;
}

export interface LoadingState {
  isPricing: boolean;
  statusMessage: string;
}