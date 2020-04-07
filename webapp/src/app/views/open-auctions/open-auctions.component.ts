import {Component, OnInit} from '@angular/core';
import {AuctionService, METHODS} from '../../services/auction.service';
import {Auction} from '../../model/model';
import {Observable} from 'rxjs';
import {MetaMaskService} from '../../services/metamask.service';
import {first} from 'rxjs/operators';

@Component({
  selector: 'app-open-auctions',
  templateUrl: './open-auctions.component.html',
  styleUrls: ['./open-auctions.component.scss']
})
export class OpenAuctionsComponent implements OnInit {

  openAuctions$: Observable<Auction[]>;

  constructor(private auctionService: AuctionService) { }

  ngOnInit(): void {
    this.openAuctions$ = this.auctionService.getMethod(METHODS.OpenAuctions);
  }

}
