import {Component, Inject, OnInit} from '@angular/core';
import {config, library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {PageScrollService} from 'ngx-page-scroll-core';
import {DOCUMENT} from '@angular/common';

library.add(fas, fab);
// alternative approach to fix SSR
config.autoReplaceSvg = true;
library.add(fas);

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'dbay';
  constructor(private pageScrollService: PageScrollService, @Inject(DOCUMENT) private document: any) { }


  scrollToMain() {
    this.pageScrollService.scroll({
      document: this.document,
      scrollTarget: '.mainAnchor',
    });
  }
}
