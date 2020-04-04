import {Component, OnInit} from '@angular/core';
import {Auction} from '../../model/model';
import {AuctionService} from '../../services/auction.service';
import {MetaMaskService} from 'src/app/metamask.service';

@Component({
  selector: 'app-my-bidding',
  templateUrl: './my-bidding.component.html',
  styleUrls: ['./my-bidding.component.scss']
})
export class MyBiddingComponent implements OnInit {
  public networkName: string;

  openAuctions: Auction[];

  constructor(private auctionService: AuctionService, private metaMaskService: MetaMaskService) {
  }

  async ngOnInit() {
    await this.metaMaskService.init();
    this.networkName = this.metaMaskService.currentNetwork;
    console.log(this.networkName);
    await this.metaMaskService.getCurrentAccount();
    console.log('---');
    await this.metaMaskService.createFirstPriceAuction('a book', 200, 80);
    try {
      const description = await this.metaMaskService.getAuctionDescription(1);
      const address = await this.metaMaskService.getAuctionAddress(1);
      console.log(description);
      console.log(address);
    } catch {
      console.log('something went wrong');
    }
    this.auctionService.getMySelling().subscribe(value => {
      this.openAuctions = value;
    });
  }
}
