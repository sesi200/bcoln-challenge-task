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
import {MetaMaskService} from './services/metamask.service';
import {EtherPipe} from './pipes/ether.pipe';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { NewAuctionComponent } from './views/my-selling/dialog/new-auction/new-auction.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatDatetimepickerModule} from '@mat-datetimepicker/core';
import {MatMomentDatetimeModule} from '@mat-datetimepicker/moment';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NgxPaginationModule} from 'ngx-pagination';
import {TimeleftPipe} from './pipes/timeleft.pipe';
import {ToastrModule, ToastrService} from 'ngx-toastr';

@NgModule({
  declarations: [
    AppComponent,
    OpenAuctionsComponent,
    MyBiddingComponent,
    MySellingComponent,
    WrapperComponent,
    NavComponent,
    ItemDisplayerComponent,
    SafePipe,
    EtherPipe,
    TimeleftPipe,
    NewAuctionComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    NgbModule,
    NgbTooltipModule,
    NgxPageScrollCoreModule.forRoot({duration: 750}),
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatMomentDatetimeModule,
    MatDatetimepickerModule,
    MatProgressSpinnerModule,
    NgxPaginationModule,
    ToastrModule.forRoot({preventDuplicates: true})
    // NgxPageScrollModule
  ],
  providers: [MetaMaskService, EtherPipe, TimeleftPipe],
  entryComponents: [NewAuctionComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
