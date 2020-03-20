pragma solidity ^0.6.1;

contract Auction {
    
    address payable public seller;
    string public description;
    uint public end_timestamp;
    address payable current_max_bidder;
    uint public current_max_bid;
    uint public min_bid;
   
   constructor(address payable _seller, string memory auction_description, uint auction_duration_seconds, uint minimum_bid) public {
       seller = _seller;
       description = auction_description;
       end_timestamp = now + auction_duration_seconds;
       current_max_bid = 0;
       min_bid = minimum_bid;
   }
   
   modifier auction_running() {
       require(now <= end_timestamp);
       _;
   }
   
   modifier auction_ended() {
       require(now > end_timestamp);
       _;
   }
   
   modifier valid_bid() {
       require(msg.value > current_max_bid);
       require(msg.value >= min_bid);
       _;
   }
   
   function bid() public payable valid_bid auction_running {
       require(msg.sender != seller);
       //revert previous max bid
       current_max_bidder.transfer(current_max_bid);
       //register new max bid
       current_max_bid = msg.value;
       current_max_bidder = msg.sender;
   }
   
   function close_auction() public auction_ended {
       seller.transfer(current_max_bid);
   }
}

contract AuctionHouse {
    Auction[] public auctions;
    
    function createAuction() external {
        Auction newAuction = new Auction(msg.sender, "desc", 60, 0);
        auctions.push(newAuction);
    }
    
    function getAuctionAdrress(uint auction_index) public view returns(address) {
        return address(auctions[auction_index]);
    }
}