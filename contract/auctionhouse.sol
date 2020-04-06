pragma solidity ^0.6.1;

abstract contract Auction {
    address payable public seller;
    string public description;
    uint public end_timestamp;
    address payable public current_max_bidder;
    uint public current_max_bid = 0;
    uint public min_bid;
    function bid(address payable bidder) virtual external payable;
    function close_auction() virtual external;
    function current_sale_price() virtual public view returns(uint);
    function is_bidder(address payable check) virtual external view returns(bool);
    bool public auction_closed = false;
    
    modifier closes_auction() virtual {
        require(!auction_closed);
        _;
        auction_closed = true;
    }
   
    modifier auction_running() virtual {
        require(now <= end_timestamp);
        _;
    }
   
    modifier auction_ended() virtual {
        require(now > end_timestamp);
        _;
    }
   
    modifier valid_bid() virtual {
        require(msg.value > current_max_bid);
        require(msg.value >= min_bid);
        _;
    }
}

contract FirstPriceAuction is Auction {
    
   constructor(address payable _seller, string memory auction_description, uint auction_duration_seconds, uint minimum_bid) public {
       seller = _seller;
       description = auction_description;
       end_timestamp = now + auction_duration_seconds;
       min_bid = minimum_bid;
   }
   
   function bid(address payable bidder) override external payable valid_bid auction_running {
       require(msg.sender != seller);
       //revert previous max bid
       current_max_bidder.transfer(current_max_bid);
       //register new max bid
       current_max_bid = msg.value;
       current_max_bidder = bidder;
   }
   
   function close_auction() override external auction_ended closes_auction {
       seller.transfer(current_max_bid);
   }
   
   function current_sale_price() override public view returns(uint) {
       return current_max_bid;
   }
   
   function is_bidder(address payable check) override external view returns(bool){
       return current_max_bidder==check;
   }
}

contract SecondPriceAuction is Auction {
    
    uint public current_second_bid = 0;
    address payable public current_second_bidder;
    
   constructor(address payable _seller, string memory auction_description, uint auction_duration_seconds, uint minimum_bid) public {
       seller = _seller;
       description = auction_description;
       end_timestamp = now + auction_duration_seconds;
       min_bid = minimum_bid;
   }
   
   function bid(address payable bidder) override external payable valid_bid auction_running {
       require(msg.sender != seller);
       //revert previous second bid
       current_second_bidder.transfer(current_second_bid);
       //register new bid
       if (msg.value > current_max_bid) {
           //bid is new first bid
           current_second_bid = current_max_bid;
           current_second_bidder = current_max_bidder;
           current_max_bid = msg.value;
           current_max_bidder = bidder;
       } else {
           //bid is new second bid
            current_second_bid = msg.value;
            current_second_bidder = bidder;
       }
   }
   
   function close_auction() override external auction_ended closes_auction{
       uint effective_second_bid;
       if (current_second_bid < min_bid) {
           effective_second_bid = min_bid;
       } else {
           effective_second_bid = current_second_bid;
       }
       seller.transfer(effective_second_bid);
       current_max_bidder.transfer(current_max_bid - effective_second_bid);
       current_second_bidder.transfer(current_second_bid);
   }
   
   modifier valid_bid() override {
        require(msg.value > current_second_bid);
        require(msg.value >= min_bid);
        _;
   }
   
   function current_sale_price() override public view returns(uint) {
       if (current_second_bid > min_bid) {
           return current_second_bid;
       } else {
           return min_bid;
       }
   }
   
   function is_bidder(address payable check) override external view returns(bool) {
       return current_max_bidder==check || current_second_bidder==check;
   }
}

contract AuctionHouse {
    Auction[] public auctions;

    event NewBid(uint auction_index, uint bid_amount);
    event AuctionClosed(uint auction_index, uint max_bid, address seller, address buyer);
    
    function create_first_price_auction(string calldata description, uint duration_in_seconds, uint minimum_bid_wei) external returns(uint256){
        Auction newAuction = new FirstPriceAuction(msg.sender, description, duration_in_seconds, minimum_bid_wei);
        auctions.push(newAuction);
        return auctions.length - 1;
    }
    
    function create_second_price_auction(string calldata description, uint duration_in_seconds, uint minimum_bid_wei) external returns(uint256){
        Auction newAuction = new SecondPriceAuction(msg.sender, description, duration_in_seconds, minimum_bid_wei);
        auctions.push(newAuction);
        return auctions.length - 1;
    }
    
    function get_auction_address(uint auction_index) public view returns(address) {
        return address(auctions[auction_index]);
    }
    
    function bid(uint auction_index) external payable {
        auctions[auction_index].bid.value(msg.value)(msg.sender);
        emit NewBid(auction_index, msg.value);
    }
    
    function close_auction(uint auction_index) external {
        auctions[auction_index].close_auction();
        emit AuctionClosed(auction_index, auctions[auction_index].current_sale_price(), auctions[auction_index].seller(), auctions[auction_index].current_max_bidder());
    }
    
    function all_auctions() external view returns(Auction[] memory) {
        return auctions;
    }
    
    function all_open_auctions() external view returns(Auction[] memory) {
        //cannot make dynamic arrays here. Have to create oversized array, then copy to correct size
        Auction[] memory oversized = new Auction[](auctions.length);
        uint count = 0;
        for(uint i = 0; i < auctions.length; i++) {
            if(!auctions[i].auction_closed()) {
                oversized[count] = auctions[count];
                count++;
            }
        }
        
        Auction[] memory ret = new Auction[](count);
        for(uint i = 0; i < count; i++) {
            ret[i] = oversized[i];
        }
        
        return ret;
    }
    
    function all_auctions_for_seller(address payable seller) external view returns(Auction[] memory) {
        //cannot make dynamic arrays here. Have to create oversized array, then copy to correct size
        Auction[] memory oversized = new Auction[](auctions.length);
        uint count = 0;
        for(uint i = 0; i < auctions.length; i++) {
            if(auctions[i].seller() == seller) {
                oversized[count] = auctions[count];
                count++;
            }
        }
        
        Auction[] memory ret = new Auction[](count);
        for(uint i = 0; i < count; i++) {
            ret[i] = oversized[i];
        }
        
        return ret;
    }
    
    function all_auctions_for_bidder(address payable bidder) external view returns(Auction[] memory) {
        //cannot make dynamic arrays here. Have to create oversized array, then copy to correct size
        Auction[] memory oversized = new Auction[](auctions.length);
        uint count = 0;
        for(uint i = 0; i < auctions.length; i++) {
            if(auctions[i].is_bidder(bidder)) {
                oversized[count] = auctions[count];
                count++;
            }
        }
        
        Auction[] memory ret = new Auction[](count);
        for(uint i = 0; i < count; i++) {
            ret[i] = oversized[i];
        }
        
        return ret;
    }
}