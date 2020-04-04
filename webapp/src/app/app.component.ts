import {Component, Inject, OnInit} from '@angular/core';
import {config, library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {PageScrollService} from 'ngx-page-scroll-core';
import {DOCUMENT} from '@angular/common';
import {MetaMaskService} from './services/metamask.service';
import {first} from 'rxjs/operators';

library.add(fas, fab);
// alternative approach to fix SSR
config.autoReplaceSvg = true;
// library.add(fas);
// library.add(fab);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'dbay';
  constructor(private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any,
              private metaMaskService: MetaMaskService) {}


  scrollToMain() {
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: '.mainAnchor',
    });
  }

  ngOnInit() {
    this.metaMaskService.init().pipe(first()).subscribe();
  }
}
