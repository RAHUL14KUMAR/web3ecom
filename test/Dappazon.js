const { expect } = require("chai")
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappazon", async() => {
  let dappazon;
  let deployer,buyer;
  let transaction;
  let balanceBefore;

  beforeEach(async()=>{
    // account setup
    [deployer,buyer] = await ethers.getSigners()

    // deploy contract
    const Dappazon = await ethers.getContractFactory("Dappazon")
    dappazon = await Dappazon.deploy()
    await dappazon.deployed()

    // transaction of item
    transaction=await dappazon.connect(deployer).listProduct(
      1,
      "shoes",
      "clothing",
      "image",
      tokens(1),
      4,
      5
    );

    // get deployer balance before
    balanceBefore=await ethers.provider.getBalance(deployer.address);
  })

  it("set the owner of contract",async()=>{
    expect(await dappazon.owner()).to.equal(deployer.address);
  })

  it('has name', async() => {
    expect(await dappazon.name()).to.equal('DAPPAZONE')
  })

  it("should returns items attribute",async()=>{
    await transaction.wait();

    const item=await dappazon.items(1);
    expect(item.id).to.equal(1);
  })

  it("emit list event",()=>{
    expect(transaction).to.emit(dappazon,"List")
  })

  it("should updtae the contract balance",async()=>{
    await transaction.wait();
    transaction=await dappazon.connect(buyer).buy(1,{value:tokens(1)})
    const result=await ethers.provider.getBalance(dappazon.address);

    expect(result).to.equal(tokens(1))
  })

  it("update buyer order count",async()=>{
    await transaction.wait();
    transaction=await dappazon.connect(buyer).buy(1,{value:tokens(1)})
    const res=await dappazon.orderCount(buyer.address);
    expect(res.toNumber()).to.equal(1);
  })

  it("add the order",async()=>{
    await transaction.wait();
    transaction=await dappazon.connect(buyer).buy(1,{value:tokens(1)})
    const order=await dappazon.orders(buyer.address,1);
    expect(order.time).to.be.greaterThan(0);
    expect(order.item.name).to.equal("shoes");
  })

  it("update the contract owner balance",async()=>{
    await transaction.wait();
    transaction=await dappazon.connect(buyer).buy(1,{value:tokens(1)})
    const result=await ethers.provider.getBalance(deployer.address);
    console.log(result.toString());
    expect(result.toString()).to.equal(balanceBefore);
    // console.log(typeof result);
    // console.log(result)
    // console.log(balanceBefore)
  })

  it("update the contract balance",async()=>{ 
    await transaction.wait();
    const result=await ethers.provider.getBalance(dappazon.address);
    expect(result).to.equal(0);
  })
})
