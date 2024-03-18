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
    event List(string name,uint256 code,uint quantity);

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


    // withdraw funds
}
