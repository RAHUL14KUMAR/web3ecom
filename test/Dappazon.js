const { expect } = require("chai")
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappazon", async() => {
  let dappazon;
  let deployer,buyer;
  let transaction;

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
})
