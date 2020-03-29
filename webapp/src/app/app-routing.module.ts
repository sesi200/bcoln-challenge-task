import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {OpenAuctionsComponent} from './views/open-auctions/open-auctions.component';


const routes: Routes = [
  {
    path: '',
    component: OpenAuctionsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,  {anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
