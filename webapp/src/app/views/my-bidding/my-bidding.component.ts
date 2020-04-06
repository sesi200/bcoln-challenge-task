import {Component, OnInit} from '@angular/core';
import {Auction} from '../../model/model';
import {AuctionService, METHODS} from '../../services/auction.service';
import {MetaMaskService} from 'src/app/services/metamask.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-my-bidding',
  templateUrl: './my-bidding.component.html',
  styleUrls: ['./my-bidding.component.scss']
})
export class MyBiddingComponent implements OnInit {
  public networkName: string;

  openAuctions$: Observable<Auction[]>;

  constructor(private metaMaskService: MetaMaskService, private auctionService: AuctionService) {
  }

  ngOnInit() {
    this.openAuctions$ = this.auctionService.getMethod(METHODS.Biddings);
  }
}
