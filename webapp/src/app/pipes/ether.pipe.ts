import { Pipe, PipeTransform } from '@angular/core';
/*
 * Raise the value exponentially
 * Takes an exponent argument that defaults to 1.
 * Usage:
 *   value | exponentialStrength:exponent
 * Example:
 *   {{ 2 | exponentialStrength:10 }}
 *   formats to: 1024
*/
@Pipe({name: 'etherConverter'})
export class EtherPipe implements PipeTransform {
  transform(value: number, exponent?: string): number {
    exponent = exponent !== undefined ? exponent : 'weiToEth';
    switch (exponent) {
      case 'weiToEth':
        return value / 1000000000000000000;
        // return Math.round(((value / 1000000000000000000) + Number.EPSILON) * 100) / 100;
      default:
        return value / 1000000000000000000;
        // return Math.round(((value / 1000000000000000000) + Number.EPSILON) * 100) / 100;
    }
  }
}
