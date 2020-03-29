import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-wrapper',
  templateUrl: './wrapper.component.html',
  styleUrls: ['./wrapper.component.scss']
})
export class WrapperComponent implements OnInit {

  activeNav = 'auctions';

  constructor(private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    this.route.data.subscribe(v => {
      this.activeNav = v.menu;
    });
  }

}
