import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { expect } from 'chai'
import { ethers } from 'hardhat'
import { ArcadiumToken } from '../typechain'

// describe("TZFEToken", function () {
//   it("should mint a new token", async function () {
//     const TZFEToken = await ethers.getContractFactory("TZFEToken");
//     const tzfeToken = await TZFEToken.deploy();
//     const contract = await tzfeToken.deployed();

//     const signers = await ethers.getSigners();
//     const address = await signers[0].getAddress();
//     const result = await tzfeToken.mint(address, "https://www.example.com");
//     const result2 = await result.wait();
//     console.log(result2.events?.[0].args);
//     // expect(
//     //   result
//     // ).to.equal("Hello, world!");
//   });
// });

describe('ArcadiumToken', function () {
  const initialSupply = 10000
  let contract: ArcadiumToken
  let owner: SignerWithAddress
  let player: SignerWithAddress
  let conversionRate: number
  let gamePrice: number
  let winMultiplier: number

  before(async () => {
    const signers = await ethers.getSigners()
    owner = signers[0]
    player = signers[1]
  })

  beforeEach(async () => {
    const ArcadiumToken = await ethers.getContractFactory('ArcadiumToken')
    contract = await ArcadiumToken.deploy(initialSupply)
    await contract.deployed()
  })

  it('should ensure that constant are correct', async () => {
    conversionRate = (await contract.CONVERSION_RATE()).toNumber()
    gamePrice = (await contract.GAME_PRICE()).toNumber()
    winMultiplier = (await contract.WIN_MULTIPLIER()).toNumber()
    expect(conversionRate).to.equal(10)
    expect(gamePrice).to.equal(1)
    expect(winMultiplier).to.equal(2)
  })

  it('should mint initial supply on deployment', async () => {
    const totalSupply = await contract.totalSupply()
    expect(totalSupply).to.equal(initialSupply)
    expect(await contract.balanceOf(owner.address)).to.equal(totalSupply)
  })

  it('should transfer tokens when user buys token', async () => {
    const value = 1
    await contract.connect(player).buy({ value })
    expect(await contract.balanceOf(owner.address)).to.equal(
      initialSupply - value * conversionRate
    )
    expect(await contract.balanceOf(player.address)).to.equal(
      value * conversionRate
    )
  })

  it('should not transfer if user does not provide ETH', async () => {
    await expect(contract.connect(player).buy({ value: 0 })).to.be.revertedWith(
      'No ETH transferred'
    )
    expect(await contract.balanceOf(owner.address)).to.equal(initialSupply)
    expect(await contract.balanceOf(player.address)).to.equal(0)
  })

  it('should use tokens when player plays game', async () => {
    const value = 1
    await contract.connect(player).buy({ value })
    await contract.connect(player).play()
    expect(await contract.balanceOf(owner.address)).to.equal(
      initialSupply - value * conversionRate + gamePrice
    )
    expect(await contract.balanceOf(player.address)).to.equal(
      value * conversionRate - gamePrice
    )
  })

  it('should not enable play if player has no tokens', async () => {
    await expect(contract.connect(player).play()).to.be.revertedWith(
      'Player has no tokens'
    )
    expect(await contract.balanceOf(owner.address)).to.equal(initialSupply)
    expect(await contract.balanceOf(player.address)).to.equal(0)
  })

  it('should not enable play if player is already playing', async () => {
    const value = 1
    await contract.connect(player).buy({ value })
    await contract.connect(player).play()
    await expect(contract.connect(player).play()).to.be.revertedWith(
      'Player cannot be playing'
    )
    expect(await contract.balanceOf(owner.address)).to.equal(
      initialSupply - value * conversionRate + gamePrice
    )
    expect(await contract.balanceOf(player.address)).to.equal(
      value * conversionRate - gamePrice
    )
  })

  it('should reward player they win the game', async () => {
    const value = 1
    await contract.connect(player).buy({ value })
    await contract.connect(player).play()
    await contract.connect(player).win()
    expect(await contract.balanceOf(owner.address)).to.equal(
      initialSupply -
        value * conversionRate +
        gamePrice -
        gamePrice * winMultiplier
    )
    expect(await contract.balanceOf(player.address)).to.equal(
      value * conversionRate - gamePrice + gamePrice * winMultiplier
    )
  })

  it('should ensure player is playing before winning', async () => {
    await expect(contract.connect(player).win()).to.be.revertedWith(
      'Player must be playing'
    )
    expect(await contract.balanceOf(owner.address)).to.equal(initialSupply)
    expect(await contract.balanceOf(player.address)).to.equal(0)
  })
})
