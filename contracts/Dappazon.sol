// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Dappazon {
    string public name="DAPPAZONE";
    address public owner;

    struct Item{
        uint id;
        string name;
        string category;
        string image;
        uint price;
        uint256 rating;
        uint256 stock;
    }
    mapping(uint256=>Item)public items;

    event Buy(address buyer,uint256 orderId,uint256 itemId);
    event List(string name,uint256 code,uint quantity);

    struct Order{
        uint256 time;
        Item item;
    }

    // here address is the buyer address and we count total number of order that buyer have
    mapping(address=>uint256) public orderCount;

    mapping (address=>mapping(uint256=>Order)) public orders;

    constructor(){
        owner=msg.sender;
    }

    // list the product
    function listProduct(uint256 _id, string memory _name, string memory _category, string memory _image, uint _price, uint256 _rating, uint256 _stock) public {
        require(msg.sender==owner, "Only owner can list the product");
        Item memory item=Item(
            _id,_name,_category,_image,_price,_rating,_stock
        );

        items[_id]=item;
        emit List(_name,_price,_stock);
    }


    // buy the product
    function buy(uint256 _id) public payable{
        // receive crypto->send the ether in the contarct that why this function is payable

        // fetch the items
        Item memory item=items[_id];
        
        require(msg.value>=item.price,"Not enough ether");
        require(item.stock>0,"Item out of stock");
        
        // create an order
        Order memory order=Order(block.timestamp,item);

        // save order to chain
        orderCount[msg.sender]++;
        orders[msg.sender][orderCount[msg.sender]]=order;

        // substrack stack
        items[_id].stock=item.stock-1;

        // emit event
        emit Buy(msg.sender,orderCount[msg.sender],_id);
    }
    // withdraw funds FROM THE CONTRACT AND GIVE IT TO THE OWNERp
    function withdraw() public{
        require(msg.sender==owner,"Only owner can withdraw funds");
        payable(owner).transfer(address(this).balance);
    }
}
