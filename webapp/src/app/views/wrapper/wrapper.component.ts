import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {environment} from '../../../environments/environment';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {
  // component that wraps all the views and sets auction house address

  activeNav = 'auctions';
  auctionHouseAddress = environment.privateAuctionHouseAddress;

  constructor(private route: ActivatedRoute) {
  }

  // read active menu item and auctionhouse address from local storage
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
