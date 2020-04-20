import {Component, Input, OnInit} from '@angular/core';
import {Auction} from '../../model/model';
import {AuctionService} from '../../services/auction.service';
import {EtherPipe} from '../../pipes/ether.pipe';
import {FormControl, Validators} from '@angular/forms';

@Component({
  selector: 'app-item-displayer',
  templateUrl: './item-displayer.component.html',
  styleUrls: ['./item-displayer.component.scss']
})
export class ItemDisplayerComponent implements OnInit {

  @Input()
  auction: Auction;
  minBidValue = 0.00;
  minBidStep = 0.00;
  timeLeft: number;
  bid: number;
  valid = true;

  constructor(private auctionSerice: AuctionService, private converter: EtherPipe) {
  }

  ngOnInit(): void {
    // TODO: based on step
    this.minBidStep = this.converter.transform(this.auction.minBidStep, 'weiToEth');
    this.minBidValue = this.converter.transform(this.auction.currentMaxBid, 'weiToEth') + this.minBidStep;
    this.bid = this.minBidValue;
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
}
