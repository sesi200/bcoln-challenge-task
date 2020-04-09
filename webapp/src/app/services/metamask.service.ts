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
    }
  ];

  public auctionHouseContract: any;

  static getTransactionObject(FROM: string, GAS: number, VALUE: number) {
    return {
      from: FROM,
      gas: GAS,
      value: VALUE
    };
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

  public createFirstPriceAuction(description: string, endTimestamp: number, minBidWei: number, minStepWei: number) {
//     // Decimal
//     const decimals = Web3.utils.toBN(18);
//
// // Amount of token
//     const tokenAmount = Web3.utils.toBN(10000000000);
//     const tokenAmountHex = '0x' + minBidWei.mul(Web3.utils.toBN(10).pow(decimals)).toString('hex');
    const minBid = Web3.utils.toWei(Web3.utils.toBN(minBidWei), 'wei');
    const minBidStep = Web3.utils.toWei(Web3.utils.toBN(minStepWei), 'wei');

    return this.getCurrentAccount().pipe(
      switchMap(currentAccount =>
        this.auctionHouseContract.methods.create_first_price_auction(description, endTimestamp, minBid, minBidStep)
          .send(MetaMaskService.getTransactionObject(currentAccount, 5000000, 0))));
  }

  public getAuctions() {
    return from(this.auctionHouseContract.methods.all_auctions().call());
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

  public getAuctionCurrentMaxBidFromAddress(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.current_max_bid().call());
  }

  public getAuctionCurrentSalePrice(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.current_sale_price().call());
  }

  public getAuctionEndTimestampFromIndex(auctionIndex: number) {
    return from(this.auctionHouseContract.methods.get_auction_address(auctionIndex).call()).pipe(
      map((auctionAddress: string) => new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress)),
      switchMap(auctionContract => from(auctionContract.methods.end_timestamp().call())
      ));
  }

  public getAuctionTimestampFromAddress(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.end_timestamp().call());
  }

  public getAuctionMinBidStepFromAddress(auctionAddress: string) {
    return from(new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.min_bid_step().call());
  }

  public bidForAuction(auctionAddress: string, value: number) {
    return this.getCurrentAccount().pipe(switchMap(currentAccount =>
      new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress).methods.bid(currentAccount).send(MetaMaskService.getTransactionObject(currentAccount, 3000000, value))));
  }
}
