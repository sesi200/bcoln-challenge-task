import {Component, NgZone, OnInit} from '@angular/core';
import {MetaMaskService} from 'src/app/metamask.service';

@Component({
  selector: 'app-my-bidding',
  templateUrl: './my-bidding.component.html',
  styleUrls: ['./my-bidding.component.scss']
})
export class MyBiddingComponent implements OnInit {
  public networkName: string;

  constructor(private metaMaskService: MetaMaskService) {
  }

  async ngOnInit() {
    await this.metaMaskService.init();
    this.networkName = this.metaMaskService.currentNetwork;
    console.log(this.networkName);
    console.log(this.metaMaskService.getCurrentAccount());
    console.log("---");
    console.log(this.metaMaskService.store('3'));
    console.log("---");
    console.log(this.metaMaskService.retreive());
  }
}
