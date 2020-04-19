import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {

  activeNav = 'auctions';
  auctionHouseAddress = environment.privateAuctionHouseAddress;
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(v => {
      this.activeNav = v.menu;
    });
    if (localStorage.getItem('auctionHouseContractAddress')) {
      this.auctionHouseAddress = localStorage.getItem('auctionHouseContractAddress');
    }
  }

  setNewLocalAdress() {
    console.log(this.auctionHouseAddress);
    localStorage.setItem('auctionHouseContractAddress', this.auctionHouseAddress);
    window.location.reload();
  }

}
