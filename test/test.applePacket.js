import assert from "assert";
import db from "../db.js";
import applePacket from "../js/apple-packet.js";

describe('The Apple Packet Function', function () {
  this.timeout(6000);
  const applePacketTest = applePacket(db)
  beforeEach(async function () {
    try {
      // clean the tables before each test run
      await db.none("TRUNCATE TABLE inputs RESTART IDENTITY CASCADE;");
      await db.none("TRUNCATE TABLE outputs RESTART IDENTITY CASCADE;");

    } catch (error) {
      console.error(error.message)
    }

  })
  it('should get the cost per apple', async function () {
    const identifier = 'box1';
    const boxCost = 1500;
    const numberOfApplesInBox = 60;
    const applesToSell = 10;
    const percentProfit = 20;
    await applePacketTest.insertValues(identifier, boxCost, numberOfApplesInBox, applesToSell, percentProfit)
    const appleCost = await applePacketTest.getCostPerApple(identifier)

    assert.deepEqual(appleCost, 25)
  });
  it('should get the number of packets she can sell', async function () {
    const identifier = 'box1';
    const boxCost = 1500;
    const numberOfApplesInBox = 100;
    const applesToSell = 10;
    const percentProfit = 20;
    await applePacketTest.insertValues(identifier, boxCost, numberOfApplesInBox, applesToSell, percentProfit)
    const applePackets = await applePacketTest.getNumberOfPackets(identifier)

    assert.deepEqual(applePackets, 10)
  })

  it('should get the cost of each packet', async function () {
    const identifier = 'box1';
    const boxCost = 1500;
    const numberOfApplesInBox = 100;
    const applesToSell = 10;
    const percentProfit = 20;
    //insert the box details
    await applePacketTest.insertValues(identifier, boxCost, numberOfApplesInBox, applesToSell, percentProfit)

    //get the number of apples in a packet
    const applePackets = await applePacketTest.getNumberOfPackets(identifier)
    //get the cost per apple
    const appleCost = await applePacketTest.getCostPerApple(identifier)

    const costPerPacket = await applePacketTest.getCostPerPacket(applePackets, appleCost)

    assert.deepEqual(costPerPacket, 250)
  });

  it('should get the recommended selling price', async function () {
    const identifier = 'box1';
    const boxCost = 1500;
    const numberOfApplesInBox = 100;
    const applesToSell = 10;
    const percentProfit = 20;
    //insert the box details
    await applePacketTest.insertValues(identifier, boxCost, numberOfApplesInBox, applesToSell, percentProfit)

    //get the number of apples in a packet
    const applePackets = await applePacketTest.getNumberOfPackets(identifier)
    console.log(applePackets)
    //get the cost per apple
    let appleCost = await applePacketTest.getCostPerApple(identifier)
    console.log(appleCost)
    const costPerPacket = await applePacketTest.getCostPerPacket(applePackets, appleCost)
    console.log(costPerPacket)

    const recommendedSellPrice = await applePacketTest.getRecommendedSellPrice(costPerPacket, identifier);

    console.log(recommendedSellPrice)
    assert.deepEqual(recommendedSellPrice, 300)


  })

  it('should insert outputs', async function () {
    const identifier = 'box1';
    const boxCost = 1500;
    const numberOfApplesInBox = 100;
    const applesToSell = 10;
    const percentProfit = 20;
    //insert the box details
    await applePacketTest.insertValues(identifier, boxCost, numberOfApplesInBox, applesToSell, percentProfit)

    const insertOutputs = await applePacketTest.insertOutputs()
    assert.equal(insertOutputs, 'insertion completed successfully')


  })
});
