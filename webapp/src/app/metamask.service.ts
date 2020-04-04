import {Inject, Injectable} from '@angular/core';
import {WEB3} from './WEB3';
import Web3 from 'web3';
import {environment} from '../environments/environment';

@Injectable()
export class MetaMaskService {

  constructor(@Inject(WEB3) private web3: Web3) {
  }

  STORAGE_ABI: any = [
    {
      constant: false,
      inputs: [
        {
          name: 'num',
          type: 'uint256'
        }
      ],
      name: 'store',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function'
    },
    {
      constant: true,
      inputs: [],
      name: 'retreive',
      outputs: [
        {
          name: '',
          type: 'uint256'
        }
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function'
    }
  ];

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
      name: 'create_second_price_auction',
      outputs: [],
      stateMutability: 'nonpayable',
      type: 'function'
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

  public currentNetwork: string;
  public storageContract: any;
  public auctionHouseContract: any;

  static getTransactionObject(FROM: string, GAS: number, VALUE: number) {
    return {
      from: FROM,
      gas: GAS,
      value: VALUE
    };
  }

  async init() {
    this.currentNetwork = await this.web3.eth.net.getNetworkType();
    switch (this.currentNetwork) {
      case 'main':
        this.storageContract = await new this.web3.eth.Contract(this.STORAGE_ABI, environment.mainStorageAddress);
        this.auctionHouseContract = await new this.web3.eth.Contract(this.AUCTIONHOUSE_ABI, environment.mainAuctionHouseAddress);
        break;
      case 'ropsten':
        this.storageContract = await new this.web3.eth.Contract(this.STORAGE_ABI, environment.ropstenStorageAddress);
        this.auctionHouseContract = await new this.web3.eth.Contract(this.AUCTIONHOUSE_ABI, environment.ropstenAuctionHouseAddress);
        break;
      case 'private':
        this.storageContract = await new this.web3.eth.Contract(this.STORAGE_ABI, environment.privateStorageAddress);
        this.auctionHouseContract = await new this.web3.eth.Contract(this.AUCTIONHOUSE_ABI, environment.privateAuctionHouseAddress);
        break;
    }
  }

  public async getCurrentAccount() {
    const accounts = await this.web3.eth.getAccounts();
    return accounts[0];
  }

  public async store(num: string) {
    const account = await this.getCurrentAccount();
    const transactionObj = await MetaMaskService.getTransactionObject(account, 5000000, 0);
    return await this.storageContract.methods.store(num).send(transactionObj);
  }

  public async retreive() {
    const account = await this.getCurrentAccount();
    return await this.storageContract.methods.retreive().call();
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

  public async getAuctionAddress(auctionIndex: number) {
    return await this.auctionHouseContract.methods.get_auction_address(auctionIndex).call();
  }

  public async getAuctionDescription(auctionIndex: number) {
    const auctionAddress = await this.auctionHouseContract.methods.get_auction_address(auctionIndex).call();
    const auctionContract = await new this.web3.eth.Contract(this.AUCTION_ABI, auctionAddress);
    return await auctionContract.methods.description().call();
  }
}
