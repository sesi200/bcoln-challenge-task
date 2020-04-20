import {Component, OnInit} from '@angular/core';
import {Auction} from '../../model/model';
import {AuctionService, METHODS} from '../../services/auction.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-my-bidding',
  templateUrl: './my-bidding.component.html',
  styleUrls: ['./my-bidding.component.scss']
})
export class MyBiddingComponent implements OnInit {
  public networkName: string;

  openAuctions$: Observable<Auction[]>;
  p = 1;
  constructor(private auctionService: AuctionService) {
  }

  ngOnInit() {
    this.openAuctions$ = this.auctionService.getMethod(METHODS.Biddings);
  }
}
