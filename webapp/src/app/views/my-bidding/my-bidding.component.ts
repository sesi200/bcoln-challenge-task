import {Component, OnInit} from '@angular/core';
import {Auction} from '../../model/model';
import {AuctionService, METHODS} from '../../services/auction.service';
import {Observable} from 'rxjs';
import {MetaMaskService} from '../../services/metamask.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-my-bidding',
  templateUrl: './my-bidding.component.html',
  styleUrls: ['./my-bidding.component.scss']
})
export class MyBiddingComponent implements OnInit {
  public networkName: string;

  openAuctions$: Observable<Auction[]>;
  p = 1;
  constructor(private auctionService: AuctionService,
              private metaMaskService: MetaMaskService,
              private toastrService: ToastrService) {
  }

  ngOnInit() {
    this.openAuctions$ = this.auctionService.getMethod(METHODS.Biddings);
    this.metaMaskService.newEvent.subscribe(value => {
      console.log(value);
      switch (value) {
        case 1:
          this.toastrService.success('There was a new bid');
          break;
        case 2:
          this.toastrService.success('Someone claimed an item');
          break;
        case -1:
          this.toastrService.error('Something went wrong');
          break;

      }
      this.openAuctions$ = this.auctionService.getMethod(METHODS.OpenAuctions);
    });
  }
}
