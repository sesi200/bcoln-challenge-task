import {Component, OnInit} from '@angular/core';
import {Auction} from '../../model/model';
import {AuctionService, METHODS} from '../../services/auction.service';
import {Observable} from 'rxjs';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {NewAuctionComponent} from './dialog/new-auction/new-auction.component';

@Component({
  selector: 'app-my-selling',
  templateUrl: './my-selling.component.html',
  styleUrls: ['./my-selling.component.scss']
})
export class MySellingComponent implements OnInit {

  openAuctions$: Observable<Auction[]>;

  constructor(private auctionService: AuctionService, private modalService: NgbModal) {}

  ngOnInit(): void {
    this.openAuctions$ = this.auctionService.getMethod(METHODS.Sellings);
  }

  newAuction() {
    const modalRef = this.modalService.open(NewAuctionComponent, {windowClass: 'dbay-modal', size: 'lg'});

    // // if (org) {
    // //   modalRef.componentInstance.organisation = org;
    // // }
    // // modalRef.componentInstance.organisationValidator = this.orgValidator;
    // modalRef.result.then((resolveOutput) => {
    //   // this.loadOrganisations();
    // }, (rejectOutput) => {
    // });
  }

}
