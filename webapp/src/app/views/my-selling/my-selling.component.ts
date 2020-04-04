import { Component, OnInit } from '@angular/core';
import {Auction} from '../../model/model';
import {AuctionService} from '../../services/auction.service';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-my-selling',
  templateUrl: './my-selling.component.html',
  styleUrls: ['./my-selling.component.scss']
})
export class MySellingComponent implements OnInit {

  openAuctions$: Observable<Auction[]>;

  constructor(private auctionService: AuctionService) {
  }

  ngOnInit(): void {
    this.openAuctions$ = this.auctionService.getMySelling();
  }

}
