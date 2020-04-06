import {Inject, Injectable} from '@angular/core';
import {WEB3} from '../WEB3';
import Web3 from 'web3';
import {environment} from '../../environments/environment';
import {from, Observable, of} from 'rxjs';
import {map, switchMap, tap} from 'rxjs/operators';

@Injectable()
export class MetaMaskService {

  constructor(@Inject(WEB3) private web3: Web3) {
  }

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
          internalType: 'uint256',
          name: 'duration_in_seconds',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'minimum_bid_wei',
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
          internalType: 'uint256',
          name: 'duration_in_seconds',
          type: 'uint256'
        },
        {
          internalType: 'uint256',
          name: 'minimum_bid_wei',
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
    }
  ];

  AUCTION_ABI: any = [
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
    }
  ];

  public auctionHouseContract: any;

  static getTransactionObject(FROM: Observable<string>, GAS: number, VALUE: number) {
    return FROM.pipe(
      map(fromAddress => ({
        from: fromAddress,
        gas: GAS,
        value: VALUE
      }))
    );
  }

  init() {
    if (this.auctionHouseContract !== undefined) {
      return of(undefined);
    }
    return from(this.web3.eth.net.getNetworkType()).pipe(
      tap(currentNetwork => {
        switch (currentNetwork) {
          case 'main':
            this.auctionHouseContract = new this.web3.eth.Contract(this.AUCTIONHOUSE_ABI, environment.mainAuctionHouseAddress);
            break;
          case 'ropsten':
            this.auctionHouseContract = new this.web3.eth.Contract(this.AUCTIONHOUSE_ABI, environment.ropstenAuctionHouseAddress);
            break;
          case 'private':
            this.auctionHouseContract = new this.web3.eth.Contract(this.AUCTIONHOUSE_ABI, environment.privateAuctionHouseAddress);
            break;
        }
        }
    ));
  }

  public getCurrentAccount() {
    return from(this.web3.eth.getAccounts()).pipe(
      map(accounts => accounts[0])
    );
  }

  public async bid(auctionIndex: number) {
    const account = await this.getCurrentAccount();
    const transactionObj = await MetaMaskService.getTransactionObject(account, 5000000, 0);
    return await this.auctionHouseContract.methods.bid(auctionIndex).send(transactionObj);
  }

  public async createFirstPriceAuction(description: string, durationInSec: number, minBidWei: number) {
    const account = await this.getCurrentAccount();
    const transactionObj = await MetaMaskService.getTransactionObject(account, 5000000, 0);
    return await this.auctionHouseContract.methods.create_first_price_auction(description, durationInSec, minBidWei).send(transactionObj);
  }

  public async getAuctions() {
    return await this.auctionHouseContract.methods.auctions().call();
  }

  public getAuctionAddress(auctionIndex: number) {
    return from(this.auctionHouseContract.methods.get_auction_address(auctionIndex).call());
  }

  public getAllOpenAuctions() {
    return from(this.auctionHouseContract.methods.all_open_auctions().call());
  }

  public getBidderAuctions() {
    return this.getCurrentAccount().pipe(
      switchMap(currentAccount => from(this.auctionHouseContract.methods.all_auctions_for_bidder(currentAccount).call()))
    );
  }

  public getSellerAuctions() {
    return this.getCurrentAccount().pipe(
      switchMap(currentAccount => from(this.auctionHouseContract.methods.all_auctions_for_seller(currentAccount).call()))
    );
  }

  public getAuctionDescriptionFromIndex(auctionIndex: number) {
    return from(this.auctionHouseContract.methods.get_auction_address(auctionIndex).call()).pipe(
      map((auctionAddress: string) => new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress)),
      switchMap(auctionContract => from(auctionContract.methods.description().call())
    ));
  }

  public getAuctionDescriptionFromAddress(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.description().call());
  }

  public getAuctionEndTimestamp(auctionIndex: number) {
    return from(this.auctionHouseContract.methods.get_auction_address(auctionIndex).call()).pipe(
      map((auctionAddress: string) => new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress)),
      switchMap(auctionContract => from(auctionContract.methods.end_timestamp().call())
      ));
  }

  public getAuctionTimestampFromAddress(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.end_timestamp().call());
  }
}
