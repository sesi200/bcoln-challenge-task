import {Component, OnInit} from '@angular/core';
import {AuctionService, METHODS} from '../../services/auction.service';
import {Auction} from '../../model/model';
import {Observable} from 'rxjs';
import {MetaMaskService} from '../../services/metamask.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-open-auctions',
  templateUrl: './open-auctions.component.html',
  styleUrls: ['./open-auctions.component.scss']
})
export class OpenAuctionsComponent implements OnInit {

  openAuctions$: Observable<Auction[]>;
  p = 1;
  constructor(private auctionService: AuctionService, private metaMaskService: MetaMaskService, private toastrService: ToastrService) { }

  ngOnInit(): void {
    this.openAuctions$ = this.auctionService.getMethod(METHODS.OpenAuctions);
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
