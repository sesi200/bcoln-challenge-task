import {Injectable} from '@angular/core';
import {Auction} from '../model/model';
import {empty, forkJoin, Observable, of} from 'rxjs';
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

  accountAddress = '';

  constructor(private metaMaskService: MetaMaskService) {
    metaMaskService.getCurrentAccount().subscribe(value => {
      this.accountAddress = this.accountAddress;
    });
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
      map((addresses: string[]) => {
        if (addresses) {
          return addresses.map(address => {
              if (address) {
                return forkJoin([
                    this.getAuctionIndexOfAddress(address),
                    this.metaMaskService.getAuctionDescriptionFromAddress(address),
                    this.metaMaskService.getAuctionCurrentSalePrice(address),
                    this.metaMaskService.getAuctionMinBidStepFromAddress(address),
                    this.metaMaskService.getAuctionTimestampFromAddress(address),
                    this.metaMaskService.getCurrentMaxBidder(address),
                    this.metaMaskService.getCurrentAccount(),
                    this.metaMaskService.getAuctionSeller(address)
                  ]
                ).pipe(
                  map(([auctionIndex, description, currentMaxBid, minBidStep, endTimestamp, currentMaxBidder, currentAccount, seller]) => ({
                    address,
                    auctionIndex,
                    description,
                    currentMaxBid,
                    minBidStep,
                    endTimestamp: this.getTimeLeft(endTimestamp.toString()),
                    currentMaxBidder,
                    iAmMaxBidder: currentMaxBidder === currentAccount,
                    seller,
                    iAmSeller: currentAccount === seller,
                    imgUrl: 'images/placeholder.jpg'
                  } as Auction))
                );
              }
            }
          );
        } else {
          const auctions: Auction[] = [];
          return of(auctions);
        }

      }),
      switchMap(auctionDetails => {
        // @ts-ignore
        if (auctionDetails.length !== 0) {
          // @ts-ignore
          return forkJoin(...auctionDetails);
        } else {
          const auctions: Auction[] = [];
          return of(auctions);
        }
      }),
      tap(results => {
        return results.sort((b: Auction, a: Auction) => {
          // if (ids === null) {
          // tslint:disable-next-line:max-line-length
          return a.endTimestamp > b.endTimestamp ? -1 : a.endTimestamp < b.endTimestamp ? 1 : 0;
          // } else {
          //   return ids.indexOf(a.publicationId) - ids.indexOf(b.publicationId);
          // }
        });
      })
    );
  }

  getMySelling(): Observable<Auction[]> {
    return this.metaMaskService.getSellerAuctions().pipe(
      map((addresses: string[]) => {
        if (addresses) {
          return addresses.map(address => {
              if (address) {
                return forkJoin([
                    this.getAuctionIndexOfAddress(address),
                    this.metaMaskService.getAuctionDescriptionFromAddress(address),
                    this.metaMaskService.getAuctionCurrentSalePrice(address),
                    this.metaMaskService.getAuctionMinBidStepFromAddress(address),
                    this.metaMaskService.getAuctionTimestampFromAddress(address),
                    this.metaMaskService.getCurrentMaxBidder(address),
                    this.metaMaskService.getCurrentAccount(),
                    this.metaMaskService.getAuctionSeller(address)
                  ]
                ).pipe(
                  map(([auctionIndex, description, currentMaxBid, minBidStep, endTimestamp, currentMaxBidder, currentAccount, seller]) => ({
                    address,
                    auctionIndex,
                    description,
                    currentMaxBid,
                    minBidStep,
                    endTimestamp: this.getTimeLeft(endTimestamp.toString()),
                    currentMaxBidder,
                    iAmMaxBidder: currentMaxBidder === currentAccount,
                    seller,
                    iAmSeller: currentAccount === seller,
                    imgUrl: 'images/placeholder.jpg'
                  } as Auction))
                );
              }
            }
          );
        } else {
          const auctions: Auction[] = [];
          return of(auctions);
        }

      }),
      switchMap(auctionDetails => {
        // @ts-ignore
        if (auctionDetails.length !== 0) {
          // @ts-ignore
          return forkJoin(...auctionDetails);
        } else {
          const auctions: Auction[] = [];
          return of(auctions);
        }
      }),
      tap(results => {
        return results.sort((b: Auction, a: Auction) => {
          // if (ids === null) {
          // tslint:disable-next-line:max-line-length
          return a.endTimestamp > b.endTimestamp ? -1 : a.endTimestamp < b.endTimestamp ? 1 : 0;
          // } else {
          //   return ids.indexOf(a.publicationId) - ids.indexOf(b.publicationId);
          // }
        });
      })
    );
  }

  getMyBidding(): Observable<Auction[]> {
    return this.metaMaskService.getBidderAuctions().pipe(
      map((addresses: string[]) => {
        if (addresses) {
          return addresses.map(address => {
              if (address) {
                return forkJoin([
                    this.getAuctionIndexOfAddress(address),
                    this.metaMaskService.getAuctionDescriptionFromAddress(address),
                    this.metaMaskService.getAuctionCurrentSalePrice(address),
                    this.metaMaskService.getAuctionMinBidStepFromAddress(address),
                    this.metaMaskService.getAuctionTimestampFromAddress(address),
                    this.metaMaskService.getCurrentMaxBidder(address),
                    this.metaMaskService.getCurrentAccount(),
                    this.metaMaskService.getAuctionSeller(address)
                  ]
                ).pipe(
                  map(([auctionIndex, description, currentMaxBid, minBidStep, endTimestamp, currentMaxBidder, currentAccount, seller]) => ({
                    address,
                    auctionIndex,
                    description,
                    currentMaxBid,
                    minBidStep,
                    endTimestamp: this.getTimeLeft(endTimestamp.toString()),
                    currentMaxBidder,
                    iAmMaxBidder: currentMaxBidder === currentAccount,
                    seller,
                    iAmSeller: currentAccount === seller,
                    imgUrl: 'images/placeholder.jpg'
                  } as Auction))
                );
              }
            }
          );
        } else {
          const auctions: Auction[] = [];
          return of(auctions);
        }

      }),
      switchMap(auctionDetails => {
        // @ts-ignore
        if (auctionDetails.length !== 0) {
          // @ts-ignore
          return forkJoin(...auctionDetails);
        } else {
          const auctions: Auction[] = [];
          return of(auctions);
        }
      }),
      tap(results => {
        return results.sort((b: Auction, a: Auction) => {
          // if (ids === null) {
          // tslint:disable-next-line:max-line-length
          return a.endTimestamp > b.endTimestamp ? -1 : a.endTimestamp < b.endTimestamp ? 1 : 0;
          // } else {
          //   return ids.indexOf(a.publicationId) - ids.indexOf(b.publicationId);
          // }
        });
      })
    );
  }

  placeBid(ether: number, auctionIndex: number): void {
    console.log(ether);
    this.metaMaskService.bidForAuctionByIndex(auctionIndex, this.convertEthToWei(ether)).pipe(first()).subscribe(value => {
      //window.location.reload();
    });

    // TODO: Should return whether a bid was successful or not..
  }

  closeAuction(auctionIndex: number): void {
    this.metaMaskService.closeAuction(auctionIndex).subscribe(value => {
      // window.location.reload();
    });
  }

  newAuction(auction: Auction): void {
    console.log('new auction:');
    console.log(auction);
    this.metaMaskService.createFirstPriceAuction(
      auction.description,
      Number(auction.endTimestamp),
      this.convertEthToWei(auction.minBid),
      this.convertEthToWei(auction.minBidStep)
    ).pipe(first()).subscribe();
    // TODO: Should return whether a bid was successful or not..
  }

  getAuctionIndexOfAddress(address: string): Observable<number> {
    return this.metaMaskService.getAuctions().pipe(
      map((addresses: string[]) => {
        return addresses.indexOf(address);
      }));
  }

  convertEthToWei(eth: number) {
    const ethWeiFactor = 1000000000000000000;
    // const ethWeiFactor = 100000000;
    return Math.floor(eth * ethWeiFactor);
    // return eth;
  }

  convertWeiToEth(wei: number) {
    const ethWeiFactor = 1000000000000000000;
    return wei / ethWeiFactor;
  }

  getTimeLeft(endTimestamp: string) {
    const currentTimestamp = Math.floor(new Date().getTime() / 1000);

    if (Number(endTimestamp) < currentTimestamp) {
      return -1;
    }
    return endTimestamp;

    // let diff = (Number(endTimestamp) - currentTimestamp);
    //
    // const days = Math.floor(diff / 86400);
    // diff -= days * 86400;
    //
    // const hours = Math.floor(diff / 3600) % 24;
    // diff -= hours * 3600;
    //
    // const minutes = Math.floor(diff / 60) % 60;
    // diff -= minutes * 60;
    //
    // const seconds = diff % 60;
    //
    // if (days > 0) {
    //   return `${days}d, ${hours}h`;
    // }
    // if (hours > 0) {
    //   return `${hours}h, ${minutes}m`;
    // }
    // if (minutes > 0) {
    //   return `${minutes}m, ${seconds}s`;
    // }
    // if (seconds > 0) {
    //   return `${seconds}s`;
    // } else {
    //   return 'Auction ended';
    // }
  }
}
