import {Injectable} from '@angular/core';
import {Auction} from '../model/model';
import {empty, forkJoin, Observable, of} from 'rxjs';
import {first, map, switchMap, tap} from 'rxjs/operators';
import {MetaMaskService} from './metamask.service';
import {HttpClient} from '@angular/common/http';


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

  constructor(private metaMaskService: MetaMaskService, private http: HttpClient) {
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
                    this.metaMaskService.getAuctionSeller(address),
                    this.metaMaskService.getImageUrl(address),
                    this.metaMaskService.getWinnerReceivedItem(address),
                    this.metaMaskService.getAuctionClosed(address)
                  ]
                ).pipe(
                  map(([auctionIndex, description, currentMaxBid, minBidStep, endTimestamp, currentMaxBidder, currentAccount, seller, imageUrl, winnerReceivedItem, auctionClosed]) => ({
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
                    imgUrl: imageUrl ? imageUrl : 'assets/images/placeholder.jpg',
                    winnerReceivedItem,
                    auctionClosed
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
      map((results: Auction[]) => {
        // console.log(results);
        results = results.filter((auction: Auction) =>  (auction.endTimestamp !== '-1' || (auction.endTimestamp === '-1' && (auction.iAmMaxBidder || auction.iAmSeller))));
        results.sort((b: Auction, a: Auction) => {
          return a.endTimestamp > b.endTimestamp ? -1 : a.endTimestamp < b.endTimestamp ? 1 : 0;
        });
        // console.log(results);
        return results;
      })
      // tap(results => {
      //   return results.sort((b: Auction, a: Auction) => {
      //     return a.endTimestamp > b.endTimestamp ? -1 : a.endTimestamp < b.endTimestamp ? 1 : 0;
      //   });
      // })
    );
  }

  getUsdRate(): Observable<any> {
    return this.http.get<any>('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD');
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
                    this.metaMaskService.getAuctionSeller(address),
                    this.metaMaskService.getImageUrl(address),
                    this.metaMaskService.getWinnerReceivedItem(address),
                    this.metaMaskService.getAuctionClosed(address)
                  ]
                ).pipe(
                  map(([auctionIndex, description, currentMaxBid, minBidStep, endTimestamp, currentMaxBidder, currentAccount, seller, imageUrl, winnerReceivedItem, auctionClosed]) => ({
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
                    imgUrl: imageUrl ? imageUrl : 'assets/images/placeholder.jpg',
                    winnerReceivedItem,
                    auctionClosed
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
          return a.endTimestamp > b.endTimestamp ? -1 : a.endTimestamp < b.endTimestamp ? 1 : 0;
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
                    this.metaMaskService.getAuctionSeller(address),
                    this.metaMaskService.getImageUrl(address),
                    this.metaMaskService.getWinnerReceivedItem(address),
                    this.metaMaskService.getAuctionClosed(address)
                  ]
                ).pipe(
                  map(([auctionIndex, description, currentMaxBid, minBidStep, endTimestamp, currentMaxBidder, currentAccount, seller, imageUrl, winnerReceivedItem, auctionClosed]) => ({
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
                    imgUrl: imageUrl ? imageUrl : 'assets/images/placeholder.jpg',
                    winnerReceivedItem,
                    auctionClosed
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
          return a.endTimestamp > b.endTimestamp ? -1 : a.endTimestamp < b.endTimestamp ? 1 : 0;
        });
      })
    );
  }

  placeBid(ether: number, auctionIndex: number): void {
    // console.log(ether);
    this.metaMaskService.bidForAuctionByIndex(auctionIndex, ether).pipe(first()).subscribe(value => {
    // this.metaMaskService.bidForAuctionByIndex(auctionIndex, this.convertEthToWei(ether)).pipe(first()).subscribe(value => {
      // window.location.reload();
    });

    // TODO: Should return whether a bid was successful or not..
  }

  closeAuction(auctionIndex: number): void {
    this.metaMaskService.closeAuction(auctionIndex).subscribe(value => {
      // window.location.reload();
    });
  }

  confirmReception(auctionIndex: number): void {
    this.metaMaskService.confirmReception(auctionIndex).subscribe(value => {
      // window.location.reload();
    });
  }

  newAuction(auction: Auction): void {
    this.metaMaskService.createFirstPriceAuction(
      auction.description,
      auction.imgUrl,
      Number(auction.endTimestamp),
      auction.minBid,
      auction.minBidStep
    ).pipe(first()).subscribe(value => {
      window.location.reload();
    });
    // TODO: Should return whether a bid was successful or not..
  }

  getAuctionIndexOfAddress(address: string): Observable<number> {
    return this.metaMaskService.getAuctions().pipe(
      map((addresses: string[]) => {
        return addresses.indexOf(address);
      }));
  }

  convertEthToWei(eth: number) {
    console.log(eth);
    const ethWeiFactor = 1000000000000000000;
    // const ethWeiFactor = 100000000;
    console.log(Math.floor(eth * ethWeiFactor));
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
      return '-1';
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
