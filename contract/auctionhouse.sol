pragma solidity ^0.6.1;

abstract contract Auction {
    address payable public seller;
    mapping (address => uint256) public all_bidders;
    string public description;
    string public img_url;
    uint public end_timestamp;
    address payable public current_max_bidder;
    uint public current_max_bid = 0;
    uint public min_bid;
    uint public min_bid_step;
    function bid(address payable bidder) virtual external payable;
    function mark_as_item_received() virtual external;
    function close_auction() virtual external;
    function current_sale_price() virtual public view returns(uint);
    function is_bidder(address payable check) virtual external view returns(bool);
    bool public winner_received_item = false;
    bool public auction_closed = false;

    modifier closes_auction() virtual {
        require(winner_received_item);
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
        require(msg.value >= current_max_bid + min_bid_step);
        require(msg.value > current_max_bid);
        require(msg.value >= min_bid);
        _;
    }
}

contract FirstPriceAuction is Auction {

   constructor(address payable _seller, string memory auction_description, string memory img, uint auction_end_timestamp, uint minimum_bid, uint minimum_bid_step) public {
       seller = _seller;
       img_url = img;
       description = auction_description;
       end_timestamp = auction_end_timestamp;
       min_bid = minimum_bid;
       min_bid_step = minimum_bid_step;
   }

   function bid(address payable bidder) override external payable valid_bid auction_running {
       require(tx.origin != seller);
       //revert previous max bid
       current_max_bidder.transfer(current_max_bid);
       //note bidder
       all_bidders[bidder] = msg.value;
       //register new max bid
       current_max_bid = msg.value;
       current_max_bidder = bidder;
   }

   //the auction winner marks the item as received, thereby unlocking the funds for the seller
   function mark_as_item_received() override external auction_ended {
       require(tx.origin == current_max_bidder);
       winner_received_item = true;
   }

   function close_auction() override external auction_ended closes_auction {
       seller.transfer(current_max_bid);
   }

   function current_sale_price() override public view returns(uint) {
       if(min_bid > current_max_bid){
           return min_bid;
       }
       return current_max_bid;
   }

   function is_bidder(address payable check) override external view returns(bool){
       return all_bidders[check] > 0;
   }
}

contract SecondPriceAuction is Auction {

    uint public current_second_bid = 0;
    address payable public current_second_bidder;

   constructor(address payable _seller, string memory auction_description, string memory img, uint auction_end_timestamp, uint minimum_bid, uint minimum_bid_step) public {
       seller = _seller;
       description = auction_description;
       img_url = img;
       end_timestamp = auction_end_timestamp;
       min_bid = minimum_bid;
       min_bid_step = minimum_bid_step;
   }

   function bid(address payable bidder) override external payable valid_bid auction_running {
       require(tx.origin != seller);
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
       //note bidder
       all_bidders[bidder] = msg.value;
   }

   //the auction winner marks the item as received, thereby unlocking the funds for the seller
   function mark_as_item_received() override external auction_ended {
       require(tx.origin == current_max_bidder);
       winner_received_item = true;
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
        require(msg.value  >= current_second_bid + min_bid_step);
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
       return all_bidders[check] > 0;
   }
}

contract AuctionHouse {
    Auction[] public auctions;

    event NewBid(uint auction_index, uint bid_amount);
    event AuctionClosed(uint auction_index, uint max_bid, address seller, address buyer);
    event ObjectReceived(uint auction_index);

    function create_first_price_auction(string calldata description, string calldata img_url, uint auction_end_timestamp, uint minimum_bid_wei, uint minimum_bid_step_wei) external returns(uint256){
        Auction newAuction = new FirstPriceAuction(tx.origin, description, img_url, auction_end_timestamp, minimum_bid_wei, minimum_bid_step_wei);
        auctions.push(newAuction);
        return auctions.length - 1;
    }

    function create_second_price_auction(string calldata description, string calldata img_url, uint auction_end_timestamp, uint minimum_bid_wei, uint minimum_bid_step_wei) external returns(uint256){
        Auction newAuction = new SecondPriceAuction(tx.origin, description, img_url, auction_end_timestamp, minimum_bid_wei, minimum_bid_step_wei);
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

    function mark_as_item_received(uint auction_index) external {
        auctions[auction_index].mark_as_item_received();
        emit ObjectReceived(auction_index);
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
            //ignore if closed and if auction ended without bids
            if(!auctions[i].auction_closed() &&
                !(now > auctions[i].end_timestamp() && auctions[i].current_max_bid() == 0)) {
                oversized[count] = auctions[i];
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
                oversized[count] = auctions[i];
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
                oversized[count] = auctions[i];
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
