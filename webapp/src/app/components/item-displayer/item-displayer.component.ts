import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Auction} from '../../model/model';
import {AuctionService} from '../../services/auction.service';
import {EtherPipe} from '../../pipes/ether.pipe';
import {FormControl, Validators} from '@angular/forms';
import {DomSanitizer} from '@angular/platform-browser';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';


@Component({
  selector: 'app-item-displayer',
  templateUrl: './item-displayer.component.html',
  styleUrls: ['./item-displayer.component.scss']
})
export class ItemDisplayerComponent implements OnInit, OnDestroy {
  // Component responsible for displaying items

  private componentDestroyed$ = new Subject<void>();
  @Input()
  auction: Auction;
  minBidValue = 0.00;
  minBidStep = 0.00;
  timeLeft: number;
  bid: number;
  valid = true;
  image;
  emptyBidder = '0x0000000000000000000000000000000000000000';
  usdEquivalent = 0;

  constructor(private auctionSerice: AuctionService, private converter: EtherPipe, private sanitizer: DomSanitizer) {
  }

  // convert initial bid and bid step values, get usd exchange rate, sanitize image, start time left timer
  ngOnInit(): void {
    this.minBidStep = this.converter.transform(this.auction.minBidStep, 'weiToEth');
    this.minBidValue = this.converter.transform(this.auction.currentMaxBid, 'weiToEth') + this.minBidStep;
    this.bid = Number(parseFloat(this.minBidValue.toString()).toPrecision(12));
    this.image = this.sanitizer.bypassSecurityTrustStyle(`url(${this.auction.imgUrl})`);
    this.usdEquivalent = this.auctionSerice.getUsdExchangeRate() * (this.auction.currentMaxBid / 1000000000000000000);

    this.recalcTime();
    const int = setInterval(() => {
      this.recalcTime();
      if (this.timeLeft < 0) {
        clearInterval(int);
      }
    }, 1000);
  }

  recalcTime() {
    this.timeLeft = Number(this.auction.endTimestamp) - Math.floor(new Date().getTime() / 1000);
    if (this.timeLeft < 0) {
      this.timeLeft = -1;
    }
  }

  placeBid() {
    this.auctionSerice.placeBid(this.bid, this.auction.auctionIndex);
  }

  claim() {
    this.auctionSerice.closeAuction(this.auction.auctionIndex);
  }

  validate() {
    if (this.minBidValue > this.bid) {
      this.valid = false;
    } else {
      this.valid = true;
    }
  }

  confirmReception() {
    this.auctionSerice.confirmReception(this.auction.auctionIndex);
  }

  ngOnDestroy(): void {
    this.componentDestroyed$.next();
    this.componentDestroyed$.complete();
  }
}
