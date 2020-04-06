import {Injectable} from '@angular/core';
import {Auction} from '../model/model';
import {forkJoin, from, Observable, of} from 'rxjs';
import {first, map, switchMap, tap} from 'rxjs/operators';
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
    return from(
      this.metaMaskService.getAllOpenAuctions()
    ).pipe(
      map((addresses: string[]) => addresses.map(address => this.metaMaskService.getAuctionDescriptionFromAddress(address).pipe(
        switchMap(description => this.metaMaskService.getAuctionTimestampFromAddress(address).pipe(
          map(endTimestamp => ({
            description,
            currentMaxBid: 3.77,
            endTimestamp,
            imgUrl: 'images/placeholder.jpg'
          } as Auction))
          ))
        ))
      ),
      switchMap(auctionDetails => forkJoin(...auctionDetails))
    );
  }

  getMySelling(): Observable<Auction[]> {
    return from(
      this.metaMaskService.getSellerAuctions()
    ).pipe(
      map((addresses: string[]) => addresses.map(address => this.metaMaskService.getAuctionDescriptionFromAddress(address).pipe(
        switchMap(description => this.metaMaskService.getAuctionTimestampFromAddress(address).pipe(
          map(endTimestamp => ({
            description,
            currentMaxBid: 3.77,
            endTimestamp,
            imgUrl: 'images/placeholder.jpg'
          } as Auction))
        ))
        ))
      ),
      switchMap(auctionDetails => forkJoin(...auctionDetails))
    );
  }

  getMyBidding(): Observable<Auction[]> {
    return from(
      this.metaMaskService.getBidderAuctions()
    ).pipe(
      map((addresses: string[]) => addresses.map(address => this.metaMaskService.getAuctionDescriptionFromAddress(address).pipe(
        switchMap(description => this.metaMaskService.getAuctionTimestampFromAddress(address).pipe(
          map(endTimestamp => ({
            description,
            currentMaxBid: 3.77,
            endTimestamp,
            imgUrl: 'images/placeholder.jpg'
          } as Auction))
        ))
        ))
      ),
      switchMap(auctionDetails => forkJoin(...auctionDetails))
    );
  }

  placeBid(): void {

  }
}
