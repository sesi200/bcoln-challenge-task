import {Component, OnInit} from '@angular/core';
import {Auction} from '../../model/model';
import {AuctionService, METHODS} from '../../services/auction.service';
import {Observable} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NewAuctionComponent} from './dialog/new-auction/new-auction.component';
import {MetaMaskService} from '../../services/metamask.service';
import {ToastrService} from 'ngx-toastr';

@Component({
  selector: 'app-my-selling',
  templateUrl: './my-selling.component.html',
  styleUrls: ['./my-selling.component.scss']
})
export class MySellingComponent implements OnInit {

  openAuctions$: Observable<Auction[]>;
  p = 1;

  constructor(private auctionService: AuctionService,
              private modalService: NgbModal,
              private metaMaskService: MetaMaskService,
              private toastrService: ToastrService) {
  }

  ngOnInit(): void {
    this.openAuctions$ = this.auctionService.getMethod(METHODS.Sellings);
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

  newAuction() {
    const modalRef = this.modalService.open(NewAuctionComponent, {windowClass: 'dbay-modal', size: 'lg'});

    // // if (org) {
    // //   modalRef.componentInstance.organisation = org;
    // // }
    // // modalRef.componentInstance.organisationValidator = this.orgValidator;
    modalRef.result.then((resolveOutput) => {

      const int = setInterval(() => {
        this.openAuctions$ = this.auctionService.getMethod(METHODS.Sellings);
        clearInterval(int);
      }, 3000);
    }, (rejectOutput) => {
    });
  }

}
