import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MortgageTestService {

  test(): Promise<void> {
    return Promise.resolve();
  }

  // private readonly plans = new Map<Mortgage['id'], Promise<MortgagePlan>>();

  // get(mortgage: Mortgage): Promise<MortgagePlan> {
  //   let promise = this.plans.get(mortgage.id)!;
  //   if (!promise) {
  //     promise = new Promise((resolve) => {
  //       const worker = new Worker(new URL('./workers/calculate-mortgage-plan.worker', import.meta.url));
  //       worker.onmessage = ({ data: plan }) => resolve(plan);
  //       worker.postMessage(mortgage);
  //     });

  //     this.plans.set(mortgage.id, promise);
  //   }

  //   return promise;
  // }

  // remove(mortgage: Mortgage): void {
  //   this.plans.delete(mortgage.id);
  // }
}
