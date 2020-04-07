import {Injectable} from '@angular/core';
import {Auction} from '../model/model';
import {forkJoin, Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {MetaMaskService} from './metamask.service';


export enum METHODS {
  OpenAuctions,
  Sellings,
  Biddings
}

@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  constructor(private metaMaskService: MetaMaskService) {
  }

  getMethod(x: METHODS): Observable<Auction[]> {
    return this.metaMaskService.init().pipe(switchMap(() => {
      switch (x) {
        case METHODS.OpenAuctions:
          return this.getOpenAuctions();
        case METHODS.Biddings:
          return this.getMyBidding();
        case METHODS.Sellings:
          return this.getMySelling();
        default:
          return this.getOpenAuctions();
      }
    }));
  }

  getOpenAuctions(): Observable<Auction[]> {
    return this.metaMaskService.getAllOpenAuctions().pipe(
      map((addresses: string[]) => addresses.map(address => forkJoin([
          this.metaMaskService.getAuctionDescriptionFromAddress(address),
          this.metaMaskService.getAuctionCurrentMaxBidFromAddress(address),
          this.metaMaskService.getAuctionTimestampFromAddress(address)
        ]).pipe(
          map(([description, currentMaxBid, endTimestamp]) => ({
            description,
            currentMaxBid,
            endTimestamp: this.getTimeLeft(endTimestamp.toString()),
            imgUrl: 'images/placeholder.jpg'
          } as Auction))
          ))
        ),
      switchMap(auctionDetails => forkJoin(...auctionDetails)));
  }

  getMySelling(): Observable<Auction[]> {
    return this.metaMaskService.getSellerAuctions().pipe(
      map((addresses: string[]) => addresses.map(address => forkJoin([
          this.metaMaskService.getAuctionDescriptionFromAddress(address),
          this.metaMaskService.getAuctionCurrentMaxBidFromAddress(address),
          this.metaMaskService.getAuctionTimestampFromAddress(address)
        ]).pipe(
        map(([description, currentMaxBid, endTimestamp]) => ({
          description,
          currentMaxBid,
          endTimestamp: this.getTimeLeft(endTimestamp.toString()),
          imgUrl: 'images/placeholder.jpg'
        } as Auction))
        ))
      ),
      switchMap(auctionDetails => forkJoin(...auctionDetails)));
  }

  getMyBidding(): Observable<Auction[]> {
    return this.metaMaskService.getBidderAuctions().pipe(
      map((addresses: string[]) => addresses.map(address => forkJoin([
          this.metaMaskService.getAuctionDescriptionFromAddress(address),
          this.metaMaskService.getAuctionCurrentMaxBidFromAddress(address),
          this.metaMaskService.getAuctionTimestampFromAddress(address)
        ]).pipe(
        map(([description, currentMaxBid, endTimestamp]) => ({
          description,
          currentMaxBid,
          endTimestamp: this.getTimeLeft(endTimestamp.toString()),
          imgUrl: 'images/placeholder.jpg'
        } as Auction))
        ))
      ),
      switchMap(auctionDetails => forkJoin(...auctionDetails)));
  }

  placeBid(): void {

  }

  getTimeLeft(endTimestamp: string) {
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);

    let diff = (Number(endTimestamp) - currentTimestamp);

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
    }
    else { return 'auction ended'; }
  }
}
