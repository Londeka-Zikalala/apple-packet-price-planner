function applePacket(db){
    //global variables

    const applePackets = [];
    const appleCost = [];
    let costPerPack = 0;
    let recommendedPrice = 0;
    //function to insert the values to be calculated with 5 parameters
    async function insertValues(identifier, boxCost, numberOfApplesInBox, applesToSell, percentProfit){
        try {
            await db.none('INSERT INTO inputs ( box_identifier, box_cost, number_of_apples_bought,apples_to_sell, percentage_profit) VALUES ($1, $2, $3, $4, $5) ON CONFLICT( box_identifier) DO UPDATE SET box_cost = excluded.box_cost, number_of_apples_bought = excluded.number_of_apples_bought,apples_to_sell = excluded.apples_to_sell,percentage_profit = excluded.percentage_profit', [identifier, boxCost, numberOfApplesInBox, applesToSell, percentProfit])
        } catch(error) {
            console.error(error.message);
        }
    }

    //get the box id
async function getBox(identifier){
    
    let box = await db.any('SELECT * FROM inputs WHERE  box_identifier = $1', [identifier]);
 
    return box
}
//function to get the cost of each apple
async function getCostPerApple(identifier){
    try{

        let box = await getBox(identifier);

        for (let i = 0; i < box.length; i++) {
            let boxValue = box[i];
            let boxCostParam = Number(boxValue.box_cost);
            let numberOfApplesInBoxParam = Number(boxValue.number_of_apples_bought);
            let costPerApple = boxCostParam / numberOfApplesInBoxParam;
            appleCost.push(costPerApple);
        }
         
        return appleCost[0];
    }
    catch(error){
        console.error(error.message)
    }
   
}

// function to get the number of packets
async function getNumberOfPackets(identifier){
    try{
        //get the box of apples
        const box = await db.manyOrNone('SELECT * FROM inputs WHERE  box_identifier = $1', [identifier]);
       
//iterate the array with the box data object
        for (let i = 0; i < box.length; i++) {
            const boxValue = box[i];
            //get the nunmber of apples in the box
            let numberOfApples = boxValue.number_of_apples_bought;
            //get the number of apples to be sold per pack
            let applesToSell= boxValue.apples_to_sell;
            let numberOfPackets =   numberOfApples / applesToSell;
            //push the value to the declared array
           applePackets.push(numberOfPackets);
        }
         
        return applePackets[0]
        
    }
    catch(error){
        console.error(error.message)
    }
}

//function to get the cost per packet
async function getCostPerPacket(applePackets, appleCost){
//To get the cost you must multiply the number of apples in a packet by the cost of each apple
try{
     costPerPack = appleCost*applePackets
    
    return costPerPack
}
catch(error){
    console.error(error.message)
}
  
}

//function to get the recommended selling price 
async function getRecommendedSellPrice(costPerPack, identifier){
    //The formula to get the selling price per pack is: income = cost * (1+percentageProfit)

     //get the box of apples to get the profit value
     const box = await db.manyOrNone('SELECT * FROM inputs WHERE  box_identifier = $1', [identifier]);
     for (let i = 0; i < box.length; i++) {
        const boxValue = box[i];
        //get the profit required
        let requiredProfit = boxValue.percentage_profit;
        let percentageProfit = requiredProfit / 100;
             recommendedPrice = costPerPack*(1 + percentageProfit) ;
     }
     //insert into the database
        return recommendedPrice
}
//Insert outputs into the database
async function insertOutputs() {
    try {
      // Get data from the inputs table
      const inputBoxes = await db.any('SELECT * FROM inputs');
 
      // Calculate results and insert into outputs table
      for (var box of inputBoxes) {
        let costPerApple = await getCostPerApple(box.box_identifier);
        console.log(costPerApple)
        let noOfPackets = await getNumberOfPackets(box.box_identifier);
        let costPerPacket = await getCostPerPacket(costPerApple,noOfPackets);
        let packetSellPrice = await getRecommendedSellPrice(costPerPacket, box.box_identifier)
  
        // Insert calculated results into the outputs table
        await db.none(`
  INSERT INTO outputs (input_id, cost_per_apple, cost_per_packet, no_of_packets, packet_sell_price)
  VALUES ($1, $2, $3, $4, $5)
  ON CONFLICT(input_id)
  DO UPDATE SET
    cost_per_apple = excluded.cost_per_apple,
    cost_per_packet = excluded.cost_per_packet,
    no_of_packets = excluded.no_of_packets,
    packet_sell_price = excluded.packet_sell_price
`, [box.id, costPerApple, costPerPacket, noOfPackets, packetSellPrice]);

      }
  
     return 'insertion completed successfully';
    } catch (error) {
      console.error('Error:', error);
      return 'insertion failed';
    }
}


return{
    insertValues,
    getBox,
    getCostPerApple,
    getNumberOfPackets,
    getCostPerPacket,
    getRecommendedSellPrice,
    insertOutputs

    
}
}

export default applePacket