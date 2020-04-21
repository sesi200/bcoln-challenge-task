import {Component, OnInit} from '@angular/core';
import {NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import {AbstractControl, FormControl, FormGroup, Validators} from '@angular/forms';
// import * as moment from 'moment';
// import {Moment, now} from 'moment';
import {Auction} from '../../../../model/model';
import {AuctionService} from '../../../../services/auction.service';
import * as _moment from 'moment';
// @ts-ignore
import {default as _rollupMoment, Moment} from 'moment';
const moment = _rollupMoment || _moment;

export function ValidateDate(control: AbstractControl) {
  const momentDate: Moment = control.value;
  if (momentDate) {
    if (momentDate.isBefore(moment.now())) {
      return {invalidDate: true};
    }
  }
  return null;
}


export function ValidateUrl(control: AbstractControl) {
  if (control.value) {
    const regex = new RegExp('(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?');
    const valid = regex.test(control.value);
    return valid ? null : {invalidURL: true};
  } else {
    return null;
  }

}


@Component({
  selector: 'app-new-auction',
  templateUrl: './new-auction.component.html',
  styleUrls: ['./new-auction.component.scss']
})
export class NewAuctionComponent implements OnInit {

  auctionForm: FormGroup;

  constructor(public activeModal: NgbActiveModal, private auctionService: AuctionService) {
  }

  ngOnInit(): void {
    this.auctionForm = new FormGroup({
      description: new FormControl('', Validators.required),
      endTimestamp: new FormControl(null, [ValidateDate]),
      minBid: new FormControl(1, [Validators.required]),
      minBidStep: new FormControl(0.1, Validators.required),
      imgUrl: new FormControl('', [ValidateUrl]),
    });
  }

  createAuction() {
    const endTs: Moment = this.auctionForm.get('endTimestamp').value;
    const auction: Auction = JSON.parse(JSON.stringify(this.auctionForm.value));
    auction.endTimestamp = endTs.unix().toString();
    this.auctionService.newAuction(auction);
    this.activeModal.close();
  }
}
