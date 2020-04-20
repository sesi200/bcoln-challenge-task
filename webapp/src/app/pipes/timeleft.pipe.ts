import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'timeleft', pure: true})
export class TimeleftPipe implements PipeTransform {
  transform(diff: number): string {
    // console.log('uesd');
    // const val = Number(value);
    // const currentTimestamp = Math.floor(new Date().getTime() / 1000);
    if (diff === -1) {
      return 'Auction ended';
    }
    // let diff = (val - currentTimestamp);

    const days = Math.floor(diff / 86400);
    diff -= days * 86400;

    const hours = Math.floor(diff / 3600) % 24;
    diff -= hours * 3600;

    const minutes = Math.floor(diff / 60) % 60;
    diff -= minutes * 60;

    const seconds = diff % 60;

    if (days > 0) {
      return `${days}d, ${hours}h`;
    }
    if (hours > 0) {
      return `${hours}h, ${minutes}m`;
    }
    if (minutes > 0) {
      return `${minutes}m, ${seconds}s`;
    }
    if (seconds > 0) {
      return `${seconds}s`;
    } else {
      return 'Auction ended';
    }
  }
}
