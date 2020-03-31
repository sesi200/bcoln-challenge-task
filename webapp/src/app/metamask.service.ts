import {Inject, Injectable} from '@angular/core';
import {WEB3} from './web3';
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

  public currentNetwork: string;
  public storageContract: any;

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
        break;
      case 'ropsten':
        this.storageContract = await new this.web3.eth.Contract(this.STORAGE_ABI, environment.ropstenStorageAddress);
        break;
      case 'private':
        this.storageContract = await new this.web3.eth.Contract(this.STORAGE_ABI, environment.privateStorageAddress);
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
}
