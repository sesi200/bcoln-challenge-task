pragma solidity ^0.6.1;

contract Auction {
    
    address payable public seller;
    string public description;
    uint public end_timestamp;
    address payable current_max_bidder;
    uint public current_max_bid;
    uint min_bid;
   
   constructor(string memory auction_description, uint auction_duration_seconds, uint minimum_bid) public {
       seller = msg.sender;
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