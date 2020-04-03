import {Injectable} from '@angular/core';
import {Auction} from '../model/model';
import {Observable, of} from 'rxjs';
import {mapTo} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class AuctionService {

  constructor() {
  }

  getOpenAuctions(): Observable<Auction[]> {
    const auctions: Auction[] = [];
    const a1 = new Auction();
    a1.description = 'A super nice chair';
    a1.currentMaxBid = 3.56;
    a1.endTimestamp = '3h 20s';
    a1.imgUrl = 'images/placeholder.jpg';
    const a2 = new Auction();
    a2.description = 'A super nice chair 2';
    a2.currentMaxBid = 4.56;
    a2.endTimestamp = '3h 20s';
    a2.imgUrl = 'images/placeholder.jpg';
    auctions.push(a1);
    auctions.push(a2);
    return of(auctions);
  }

  getMySelling(): Observable<Auction[]> {
    const auctions: Auction[] = [];
    const a1 = new Auction();
    a1.description = 'A super nice chair';
    a1.currentMaxBid = 3.56;
    a1.endTimestamp = '3h 20s';
    a1.imgUrl = 'images/placeholder.jpg';
    const a2 = new Auction();
    a2.description = 'A super nice chair 2';
    a2.currentMaxBid = 4.56;
    a2.endTimestamp = '3h 20s';
    a2.imgUrl = 'images/placeholder.jpg';
    auctions.push(a1);
    auctions.push(a2);
    return of(auctions);
  }

  getMyBidding(): Observable<Auction[]> {
    const auctions: Auction[] = [];
    const a1 = new Auction();
    a1.description = 'A super nice chair';
    a1.currentMaxBid = 3.56;
    a1.endTimestamp = '3h 20s';
    a1.imgUrl = 'images/placeholder.jpg';
    const a2 = new Auction();
    a2.description = 'A super nice chair 2';
    a2.currentMaxBid = 4.56;
    a2.endTimestamp = '3h 20s';
    a2.imgUrl = 'images/placeholder.jpg';
    auctions.push(a1);
    auctions.push(a2);
    return of(auctions);
  }

  placeBid(): void {

  }
}
