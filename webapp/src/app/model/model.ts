export class Auction {
  address: string;
  auctionIndex: number;
  seller: string;
  description: string;
  endTimestamp: string;
  currentMaxBidder: string;
  currentMaxBid: number;
  minBid: number;
  minBidStep: number;
  imgUrl: string;
  iAmMaxBidder = false;
}
