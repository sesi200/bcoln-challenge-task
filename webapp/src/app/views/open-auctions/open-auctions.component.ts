import { Component, OnInit } from '@angular/core';
import {AuctionService} from '../../services/auction.service';
import {Auction} from '../../model/model';

@Component({
  selector: 'app-open-auctions',
  templateUrl: './open-auctions.component.html',
  styleUrls: ['./open-auctions.component.scss']
})
export class OpenAuctionsComponent implements OnInit {

  openAuctions: Auction[];
  constructor(private auctionService: AuctionService) { }

  ngOnInit(): void {
    this.auctionService.getOpenAuctions().subscribe(value => {
      this.openAuctions = value;
    });

  }

}
