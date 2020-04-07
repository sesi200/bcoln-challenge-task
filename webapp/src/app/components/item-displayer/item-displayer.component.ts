import {Component, Input, OnInit} from '@angular/core';
import {Auction} from '../../model/model';
import {AuctionService} from '../../services/auction.service';
import {EtherPipe} from '../../pipes/ether.pipe';

@Component({
  selector: 'app-item-displayer',
  templateUrl: './item-displayer.component.html',
  styleUrls: ['./item-displayer.component.scss']
})
export class ItemDisplayerComponent implements OnInit {

  @Input()
  auction: Auction;
  bidValue = 0.00;
  constructor(private auctionSerice: AuctionService, private converter: EtherPipe) { }

  ngOnInit(): void {
    // TODO: based on step
    this.bidValue = this.converter.transform(this.auction.currentMaxBid, 'weiToEth')  + 0.01;
  }

  placeBid(){
    this.auctionSerice.placeBid(this.bidValue, this.auction.auctionIndex);
  }

}
