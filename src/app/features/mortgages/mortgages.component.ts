import { Component } from '@angular/core';

import { Mortgage } from '@core/models/mortgage';

import { MortgageCardComponent } from './components/mortgage-card/mortgage-card.component';
import { injectData } from '@core/signals/inject-data';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-mortgages',
  templateUrl: './mortgages.component.html',
  imports: [RouterLink, MortgageCardComponent],
})
export class MortgagesComponent {
  mortgages = injectData<Mortgage[]>('mortgages');
}
