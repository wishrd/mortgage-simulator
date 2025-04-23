import { Injectable } from '@angular/core';
import { Mortgage } from '@core/models/mortgage';
import { MortgagePlan } from '@core/models/mortgage-plan';

@Injectable({ providedIn: 'root' })
export class MortgagePlanService {

  private readonly plans = new Map<Mortgage['id'], Promise<MortgagePlan>>();

  get(mortgage: Mortgage): Promise<MortgagePlan> {
    let promise = this.plans.get(mortgage.id)!;
    if (!promise) {
      promise = new Promise((resolve) => {
        const worker = new Worker(new URL('./workers/calculate-mortgage-plan.worker', import.meta.url));
        worker.onmessage = ({ data: plan }) => resolve(plan);
        worker.postMessage(mortgage);
      });

      this.plans.set(mortgage.id, promise);
    }

    return promise;
  }

  remove(mortgage: Mortgage): void {
    this.plans.delete(mortgage.id);
  }
}
