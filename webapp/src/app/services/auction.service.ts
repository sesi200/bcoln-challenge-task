import {Injectable} from '@angular/core';
import {Auction} from '../model/model';
import {empty, forkJoin, Observable, of} from 'rxjs';
import {catchError, first, map, switchMap, tap} from 'rxjs/operators';
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


  usdExchangeRate = 0;

  constructor(private metaMaskService: MetaMaskService, private http: HttpClient) {
    this.getUsdRate().subscribe(value => {
      this.usdExchangeRate = value.USD;
    });
  }

  // manages the execution of the methods which access the blockchain and makes sure the network and contracts are initialized
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

  // gets the open auctions from the metamask service and packs the information in an auction object
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
    return this.http.get<any>('https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=USD').pipe(catchError(err => {
      return of(0);
    }));
  }

  getUsdExchangeRate(): number{
    return this.usdExchangeRate;
  }


  // gets auctions you are selling from the metamask service and packs the information in an auction object
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

  // gets the auctions you are bidding from the metamask service and packs the information in an auction object
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

  // places a bid via the metamask service
  placeBid(ether: number, auctionIndex: number): void {
    // console.log(ether);
    this.metaMaskService.bidForAuctionByIndex(auctionIndex, ether).pipe(first()).subscribe(value => {
    // this.metaMaskService.bidForAuctionByIndex(auctionIndex, this.convertEthToWei(ether)).pipe(first()).subscribe(value => {
      // window.location.reload();
    });

    // TODO: Should return whether a bid was successful or not..
  }

  // closes and auction via the metamask service
  closeAuction(auctionIndex: number): void {
    this.metaMaskService.closeAuction(auctionIndex).subscribe(value => {
      // window.location.reload();
    });
  }

  // confirms the reception of an auction item via the metamask service
  confirmReception(auctionIndex: number): void {
    this.metaMaskService.confirmReception(auctionIndex).subscribe(value => {
      // window.location.reload();
    });
  }

 // creates a new auction via the metamask service
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

  // gets the index of an auction from the address via the metamask service
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
  }
}
