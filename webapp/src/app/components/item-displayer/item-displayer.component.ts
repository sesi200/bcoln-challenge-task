import {Component, Input, OnInit} from '@angular/core';
import {Auction} from '../../model/model';

@Component({
  selector: 'app-item-displayer',
  templateUrl: './item-displayer.component.html',
  styleUrls: ['./item-displayer.component.scss']
})
export class ItemDisplayerComponent implements OnInit {

  @Input()
  auction: Auction;
  constructor() { }

  ngOnInit(): void {
  }

}
