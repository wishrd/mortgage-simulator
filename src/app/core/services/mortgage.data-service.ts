import type { DataService } from './data-service';
import { inject, Injectable } from '@angular/core';
import { DexieDatabase } from './storage/database/dexie.database';
import { OptionalId } from '@core/models/optional-id';
import { Mortgage } from '@core/models/mortgage';
import { MortgageAdapter } from './adapters/mortgage.adapter';

@Injectable({ providedIn: 'root' })
export class MortgageDataService implements DataService<Mortgage> {

  private readonly mortgagesDb = inject(DexieDatabase).mortgages;
  private readonly adapter = inject(MortgageAdapter);

  async all(): Promise<Mortgage[]> {
    return (await this.mortgagesDb.toArray()).map(data => this.adapter.to(data));
  }

  async get(id: string): Promise<Mortgage | null> {
    const mortgage = await this.mortgagesDb.get(id);
    return mortgage ? this.adapter.to(mortgage) : null;
  }

  async save(mortgage: OptionalId<Mortgage>): Promise<void> {
    const mortgageData = this.adapter.from(mortgage);
    if (!mortgageData.id) {
      mortgageData.id = crypto.randomUUID();
    }

    return this.mortgagesDb.put(mortgageData);
  }

  async delete(id: string): Promise<void> {
    return this.mortgagesDb.delete(id);
  }
}
