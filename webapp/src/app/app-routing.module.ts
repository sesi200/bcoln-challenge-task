import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OpenAuctionsComponent} from './views/open-auctions/open-auctions.component';
import {NavComponent} from './components/nav/nav.component';
import {WrapperComponent} from './views/wrapper/wrapper.component';


const routes: Routes = [
  {
    path: 'auctions',
    data: {
      menu: 'auctions'
    },
    component: WrapperComponent
  },
  {
    path: 'bidding',
    data: {
      menu: 'bidding'
    },
    component: WrapperComponent
  },
  {
    path: 'selling',
    data: {
      menu: 'selling'
    },
    component: WrapperComponent
  },
  {
    path: '',
    data: {
      menu: 'auctions'
    },
    component: WrapperComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
