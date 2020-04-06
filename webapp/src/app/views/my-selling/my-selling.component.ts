import {Component, OnInit} from '@angular/core';
import {Auction} from '../../model/model';
import {AuctionService, METHODS} from '../../services/auction.service';
import {Observable} from 'rxjs';
import {MetaMaskService} from '../../services/metamask.service';

@Component({
  selector: 'app-my-selling',
  templateUrl: './my-selling.component.html',
  styleUrls: ['./my-selling.component.scss']
})
export class MySellingComponent implements OnInit {

  openAuctions$: Observable<Auction[]>;

  constructor(private auctionService: AuctionService, private metaMaskService: MetaMaskService) {
  }

  ngOnInit(): void {
    this.openAuctions$ = this.auctionService.getMethod(METHODS.Sellings);
  }

}
