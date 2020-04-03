import { Component, OnInit } from '@angular/core';
import {Auction} from '../../model/model';
import {AuctionService} from '../../services/auction.service';

@Component({
  selector: 'app-my-selling',
  templateUrl: './my-selling.component.html',
  styleUrls: ['./my-selling.component.scss']
})
export class MySellingComponent implements OnInit {

  openAuctions: Auction[];

  constructor(private auctionService: AuctionService) {
  }

  ngOnInit(): void {
    this.auctionService.getMySelling().subscribe(value => {
      this.openAuctions = value;
    });

  }

}
