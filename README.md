# bcoln-challenge-task
Online auction platforms are a popular tool to sell used items. Well-known services like Ricardo or Ebay are built in a client-server architecture. Within the challenge task of the course Blockchain and Overlay Networks 2020 at the University of Zurich, a similar system was developed on the technology of distributed systems. This distributed application (dapp) enables the creation of an auction platform on the basis of a smart contract on the ethereum blockchain. This platform has the functionality to create and bid for time-limited offers. If the item is sold after this period, the money of the winner of the auction is transferred to the seller. We called the developed system dbay. It can be accessed via https://bcoln-litecoin.web.app/.

## Run app

### Prerequisites
In order to use the frontend in a local environment, the following prerequisites need to be fulfilled:
- Local instance of Ganache running
- Git installed
- Node.js version 12 or higher installed
- Metamask plugin
- Angular CLI 9 installed ```npm install -g @angular/cli```

### Run locally
Follow these steps to run the gui locally:
 Open the git bash in the folder you want to install the gui
1. Clone the git repository ```git clone git@github.com:sesi200/bcoln-challenge-task.git```
2. Quick-Start a ganache environment
3. Open http://remix.ethereum.org/ and choose a Solidity workspace
4. In the installation folder (from github) you will find the following file: bcoln-challenge-task\contract\auctionhouse.sol
5. Copy this file into the remix IDE, compile the contract (with compiler version 0.6.1)
6. Switch to the deployment tab, choose a Web3 Provider Environment with the Ganache url: HTTP://127.0.0.1:7545
7. Make sure in the contract selection drop-down, the AuctionHouse Contract (Second Entry) is selected. Deploy the smart contract.
8. Write down the address of the deployed contract.
9. In the git bash, navigate to bcoln-challenge-task\webapp\ in your installation folder.
10. Run the command ```npm install``` followed by ```npm start```
11. After the app has started up, the local frontend should be available at http://localhost:4200
12. Make sure you have selected HTTP://127.0.0.1:7545 as network in metamask and import a few accounts from ganache
13. Enter the auctionHouse contract address from step 8 in the corresponding field and refresh the page
