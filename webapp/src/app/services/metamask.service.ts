import {Inject, Injectable} from '@angular/core';
import {WEB3} from '../WEB3';
import Web3 from 'web3';
import {environment} from '../../environments/environment';
import {BehaviorSubject, from, Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';
import BigNumber from 'bignumber.js';
import {ToastrService} from 'ngx-toastr';


@Injectable()
export class MetaMaskService {

  newEventSubject = new BehaviorSubject<number>(0);
  newEvent = this.newEventSubject.asObservable();


  constructor(@Inject(WEB3) private web3: Web3, private toastr: ToastrService) {
  }

  // ABI to interact with the auctionhouse contract
  AUCTIONHOUSE_ABI: any = [
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'auction_index',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'max_bid',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'seller',
          type: 'address'
        },
        {
          indexed: false,
          internalType: 'address',
          name: 'buyer',
          type: 'address'
        }
      ],
      name: 'AuctionClosed',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'auction_index',
          type: 'uint256'
        },
        {
          indexed: false,
          internalType: 'uint256',
          name: 'bid_amount',
          type: 'uint256'
        }
      ],
      name: 'NewBid',
      type: 'event'
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          internalType: 'uint256',
          name: 'auction_index',
          type: 'uint256'
        }
      ],
      name: 'ObjectReceived',
      type: 'event'
    },
    {
      inputs: [],
      name: 'all_auctions',
      outputs: [
        {
          internalType: 'contract Auction[]',
          name: '',
          type: 'address[]'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address payable',
          name: 'bidder',
          type: 'address'
        }
      ],
      name: 'all_auctions_for_bidder',
      outputs: [
        {
          internalType: 'contract Auction[]',
          name: '',
          type: 'address[]'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address payable',
          name: 'seller',
          type: 'address'
        }
      ],
      name: 'all_auctions_for_seller',
      outputs: [
        {
          internalType: 'contract Auction[]',
          name: '',
          type: 'address[]'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'all_open_auctions',
      outputs: [
        {
          internalType: 'contract Auction[]',
          name: '',
          type: 'address[]'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      name: 'auctions',
      outputs: [
        {
          internalType: 'contract Auction',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'auction_index',
          type: 'uint256'
        }
      ],
      name: 'bid',
      outputs: [],
      stateMutability: 'payable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'auction_index',
          type: 'uint256'
        }
      ],
      name: 'close_auction',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'description',
          type: 'string'
        },
        {
          internalType: 'string',
          name: 'img_url',
          type: 'string'
        },
        {
          internalType: 'uint256',
          name: 'auction_end_timestamp',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'minimum_bid_wei',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'minimum_bid_step_wei',
          type: 'uint256'
        }
      ],
      name: 'create_first_price_auction',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'string',
          name: 'description',
          type: 'string'
        },
        {
          internalType: 'string',
          name: 'img_url',
          type: 'string'
        },
        {
          internalType: 'uint256',
          name: 'auction_end_timestamp',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'minimum_bid_wei',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'minimum_bid_step_wei',
          type: 'uint256'
        }
      ],
      name: 'create_second_price_auction',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'auction_index',
          type: 'uint256'
        }
      ],
      name: 'get_auction_address',
      outputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'uint256',
          name: 'auction_index',
          type: 'uint256'
        }
      ],
      name: 'mark_as_item_received',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    }
  ];

  // ABI to interact with the auction contract
  AUCTION_ABI: any = [
    {
      inputs: [
        {
          internalType: 'address',
          name: '',
          type: 'address'
        }
      ],
      name: 'all_bidders',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'auction_closed',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address payable',
          name: 'bidder',
          type: 'address'
        }
      ],
      name: 'bid',
      outputs: [],
      stateMutability: 'payable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'close_auction',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'current_max_bid',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'current_max_bidder',
      outputs: [
        {
          internalType: 'address payable',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'current_sale_price',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'description',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'end_timestamp',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'img_url',
      outputs: [
        {
          internalType: 'string',
          name: '',
          type: 'string'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [
        {
          internalType: 'address payable',
          name: 'check',
          type: 'address'
        }
      ],
      name: 'is_bidder',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'mark_as_item_received',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      inputs: [],
      name: 'min_bid',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'min_bid_step',
      outputs: [
        {
          internalType: 'uint256',
          name: '',
          type: 'uint256'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'seller',
      outputs: [
        {
          internalType: 'address payable',
          name: '',
          type: 'address'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    },
    {
      inputs: [],
      name: 'winner_received_item',
      outputs: [
        {
          internalType: 'bool',
          name: '',
          type: 'bool'
        }
      ],
      stateMutability: 'view',
      type: 'function'
    }
  ];

  public auctionHouseContract: any;

  // Format an object to pass on with a message to the contracts
  static getTransactionObject(FROM: string, GAS: number, VALUE: number | string) {
    return {
      from: FROM,
      gas: GAS,
      value: VALUE
    };
  }

  init() {
    // only init once
    if (this.auctionHouseContract !== undefined) {
      return of(undefined);
    }

    // init the contracts/network with the corresponding contract addresses
    const privateAddress = localStorage.getItem('auctionHouseContractAddress') ? localStorage.getItem('auctionHouseContractAddress') : environment.privateAuctionHouseAddress;
    const ropstenAddress = localStorage.getItem('auctionHouseContractAddress') ? localStorage.getItem('auctionHouseContractAddress') : environment.ropstenAuctionHouseAddress;
    const rinkebyAddress = localStorage.getItem('auctionHouseContractAddress') ? localStorage.getItem('auctionHouseContractAddress') : environment.rinkebyAuctionHouseAddress;
    const mainNetAddress = localStorage.getItem('auctionHouseContractAddress') ? localStorage.getItem('auctionHouseContractAddress') : environment.mainAuctionHouseAddress;
    return from(this.web3.eth.net.getNetworkType()).pipe(
      tap(currentNetwork => {
        try {
          switch (currentNetwork) {
            case 'main':
              this.auctionHouseContract = new this.web3.eth.Contract(this.AUCTIONHOUSE_ABI, mainNetAddress);
              break;
            case 'ropsten':
              this.auctionHouseContract = new this.web3.eth.Contract(this.AUCTIONHOUSE_ABI, ropstenAddress);
              break;
            case 'rinkeby':
              this.auctionHouseContract = new this.web3.eth.Contract(this.AUCTIONHOUSE_ABI, rinkebyAddress);
              break;
            case 'private':
              this.auctionHouseContract = new this.web3.eth.Contract(this.AUCTIONHOUSE_ABI, privateAddress);
              break;
            default:
              throw 'Not supported network';
              break;
          }
        } catch (e) {
          this.toastr.error('The auctionhouse address provided is not valid', 'Not a valid address');
        }

        }
      ),
      tap(() => this.newBidEvent()),
      tap(() => this.auctionClosedEvent()),
      tap(() => this.objectReceivedEvent())
    );
  }

  public getCurrentAccount() {
    return from(this.web3.eth.getAccounts()).pipe(
      map(accounts => accounts[0])
    );
  }

  // create an auction with the type first price auction by calling the contract
  public createFirstPriceAuction(description: string, imgUrl: string, endTimestamp: number, minBidWei: number, minStepWei: number) {
    const BNminBid = new BigNumber(minBidWei);
    const BNminStep = new BigNumber(minStepWei);
    const minBid = BNminBid.multipliedBy(1000000000000000000).toFixed();
    const minBidStep = BNminStep.multipliedBy(1000000000000000000).toFixed();


    return this.getCurrentAccount().pipe(
      switchMap(currentAccount =>
        this.auctionHouseContract.methods.create_first_price_auction(description, imgUrl, endTimestamp, minBid, minBidStep)
          .send(MetaMaskService.getTransactionObject(currentAccount, 5000000, 0))));
  }

  // gets all auctions
  public getAuctions() {
    return from(this.auctionHouseContract.methods.all_auctions().call());
  }

  // gets the auction address from an index
  public getAuctionAddress(auctionIndex: number) {
    return from(this.auctionHouseContract.methods.get_auction_address(auctionIndex).call());
  }

  // gets all open auctions
  public getAllOpenAuctions() {
    return from(this.auctionHouseContract.methods.all_open_auctions().call());
  }

  // gets the auctions you are bidding
  public getBidderAuctions() {
    return this.getCurrentAccount().pipe(
      switchMap(currentAccount => from(this.auctionHouseContract.methods.all_auctions_for_bidder(currentAccount).call()))
    );
  }

  // gets the auctions where you sell
  public getSellerAuctions() {
    return this.getCurrentAccount().pipe(
      switchMap(currentAccount => from(this.auctionHouseContract.methods.all_auctions_for_seller(currentAccount).call()))
    );
  }

  // gets the auction description by the index of the auction
  public getAuctionDescriptionFromIndex(auctionIndex: number) {
    return from(this.auctionHouseContract.methods.get_auction_address(auctionIndex).call()).pipe(
      map((auctionAddress: string) => new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress)),
      switchMap(auctionContract => from(auctionContract.methods.description().call())
      ));
  }

  // gets the auction description by the address of the auction
  public getAuctionDescriptionFromAddress(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.description().call());
  }

  // gets the auction max bid by the address of the auction
  public getAuctionCurrentMaxBidFromAddress(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.current_max_bid().call());
  }

  // gets the auction current sale price by the address of the auction
  public getAuctionCurrentSalePrice(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.current_sale_price().call());
  }

  // gets the timestamp when the auction ends by the index of the auction
  public getAuctionEndTimestampFromIndex(auctionIndex: number) {
    return from(this.auctionHouseContract.methods.get_auction_address(auctionIndex).call()).pipe(
      map((auctionAddress: string) => new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress)),
      switchMap(auctionContract => from(auctionContract.methods.end_timestamp().call())
      ));
  }

  // gets the timestamp when the auction ends by the address of the auction
  public getAuctionTimestampFromAddress(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.end_timestamp().call());
  }

  // gets the min bid step by the address of the auction
  public getAuctionMinBidStepFromAddress(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.min_bid_step().call());
  }

  // gets the address of the max bidder by the address of the auction
  public getCurrentMaxBidder(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.current_max_bidder().call());
  }

  // gets the address of the seller by the address of the auction
  public getAuctionSeller(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.seller().call());
  }

  // gets the url of the image for an auction by the address of the auction
  public getImageUrl(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.img_url().call());
  }

  // checks if the winner received the item by the address of the auction
  public getWinnerReceivedItem(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.winner_received_item().call());
  }

  // checks if the auction is closed by the address of the auction
  public getAuctionClosed(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.auction_closed().call());
  }

  // bids for an auction by the address of the auction
  public bidForAuction(auctionAddress: string, value: number) {
    const BNvalue = new BigNumber(value);
    return this.getCurrentAccount().pipe(switchMap(currentAccount =>
      new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.bid(currentAccount).send(MetaMaskService.getTransactionObject(currentAccount, 3000000, BNvalue.toFixed()))));
  }

  // bids for an auction by the index of the auction which is preferred because this sends events
  public bidForAuctionByIndex(auctionIndex: number, value: number) {
    const BNvalue = new BigNumber(value);
    console.log(BNvalue.multipliedBy(1000000000000000000).toFixed());
    return this.getCurrentAccount().pipe(switchMap(currentAccount =>
      this.auctionHouseContract.methods.bid(auctionIndex).send(MetaMaskService.getTransactionObject(currentAccount, 3000000, BNvalue.multipliedBy(1000000000000000000).toFixed()))));
  }

  // closes an auction by the index of the auction
  public closeAuction(auctionIndex: number) {
    return this.getCurrentAccount().pipe(
      switchMap(currentAccount =>
        this.auctionHouseContract.methods.close_auction(auctionIndex)
          .send(MetaMaskService.getTransactionObject(currentAccount, 5000000, 0))));
  }

  // confirms the reception of an item by the index of the auction
  public confirmReception(auctionIndex: number) {
    return this.getCurrentAccount().pipe(
      switchMap(currentAccount =>
        this.auctionHouseContract.methods.mark_as_item_received(auctionIndex)
          .send(MetaMaskService.getTransactionObject(currentAccount, 5000000, 0))));
  }

  // manage the new bid event
  public newBidEvent() {
    this.auctionHouseContract.events.NewBid().on('data', (event) => {
      // console.log(event.returnValues);
      this.newEventSubject.next(1);
      this.newEventSubject.next(0);
    }).on('error', (event) => {
      // console.error(event);
      this.newEventSubject.next(-1);
      this.newEventSubject.next(0);
    });
  }

  // manage the auction closed event
  public auctionClosedEvent() {
    this.auctionHouseContract.events.AuctionClosed().on('data', (event) => {
      // console.log(event.returnValues);
      this.newEventSubject.next(2);
      this.newEventSubject.next(0);
    }).on('error', (event) => {
      // console.error(event);
      this.newEventSubject.next(-1);
      this.newEventSubject.next(0);
    });
  }

  // manage the object received event
  public objectReceivedEvent() {
    this.auctionHouseContract.events.ObjectReceived().on('data', (event) => {
      // console.log(event.returnValues);
      this.newEventSubject.next(3);
      this.newEventSubject.next(0);
    }).on('error', (event) => {
      // console.error(event);
      this.newEventSubject.next(-1);
      this.newEventSubject.next(0);
    });
  }
}
