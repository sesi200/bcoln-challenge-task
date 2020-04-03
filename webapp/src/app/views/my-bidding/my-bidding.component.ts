import {Component, OnInit} from '@angular/core';
import {Auction} from '../../model/model';
import {AuctionService} from '../../services/auction.service';

@Component({
  selector: 'app-my-bidding',
  templateUrl: './my-bidding.component.html',
  styleUrls: ['./my-bidding.component.scss']
})
export class MyBiddingComponent implements OnInit {

  openAuctions: Auction[];

  constructor(private auctionService: AuctionService) {
  }

  ngOnInit(): void {
    this.auctionService.getMySelling().subscribe(value => {
      this.openAuctions = value;
    });

  }
}
