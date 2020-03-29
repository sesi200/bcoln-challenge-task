import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OpenAuctionsComponent } from './views/open-auctions/open-auctions.component';
import { MyBiddingComponent } from './views/my-bidding/my-bidding.component';
import { MySellingComponent } from './views/my-selling/my-selling.component';
import {NgbModule, NgbTooltip, NgbTooltipModule} from '@ng-bootstrap/ng-bootstrap';
import {NgxPageScrollCoreModule} from 'ngx-page-scroll-core';
import {NgxPageScrollModule} from 'ngx-page-scroll';
import { WrapperComponent } from './views/wrapper/wrapper.component';
import { NavComponent } from './components/nav/nav.component';
import { ItemDisplayerComponent } from './components/item-displayer/item-displayer.component';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {SafePipe} from './pipes/safestyle.pipe';

@NgModule({
  declarations: [
    AppComponent,
    OpenAuctionsComponent,
    MyBiddingComponent,
    MySellingComponent,
    WrapperComponent,
    NavComponent,
    ItemDisplayerComponent,
    SafePipe
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbTooltipModule,
    NgxPageScrollCoreModule.forRoot({duration: 750}),
    FontAwesomeModule,
    // NgxPageScrollModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
