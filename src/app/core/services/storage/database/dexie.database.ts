import { Injectable } from '@angular/core';

import Dexie, { Table } from 'dexie';

import { MortgageData } from '../models/mortgage-data';

@Injectable({ providedIn: 'root' })
export class DexieDatabase extends Dexie {
  mortgages!: Table<MortgageData>;

  constructor() {
    super('mortgageSimulator');
    this.version(1).stores({
      mortgages: 'id',
    });
  }
}
