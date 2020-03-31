import {InjectionToken} from '@angular/core';
import Web3 from 'web3';

export const WEB3 = new InjectionToken<Web3>('web3', {
  providedIn: 'root',
  factory: () => {
    // tslint:disable-next-line:no-string-literal
    const provider = window['ethereum'];
    if (provider) {
      provider.enable();
      return new Web3(provider);
    } else {
      window.location.href = '/error';
    }
  }
});
