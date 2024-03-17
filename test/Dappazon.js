const { expect } = require("chai")
const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe("Dappazon", async() => {
  let dappazon;
  before(async()=>{
    const Dappazon = await ethers.getContractFactory("Dappazon")
    dappazon = await Dappazon.deploy()
    await dappazon.deployed()
  })

  it('has name', async() => {
    expect(await dappazon.name()).to.equal('DAPPAZONE')
  })
})
