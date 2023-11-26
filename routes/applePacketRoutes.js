function appleRoute(packetPlanner){
    async function showIndex(req, res, next){
        try{
            res.render('index')
        }catch(error){
            next(error)
        }
       
     
    }

    async function inputValues(req, res, next){
       try{
            const identifier = req.body.box_identifier;
            const boxCost = req.body.box_cost;
            const numberOfApplesInBox = req.body.number_of_apples_bought;
            const applesToSell = req.body.apples_to_sell;
            const percentProfit = req.body.percentage_profit;
        await packetPlanner.insertValues(identifier, boxCost, numberOfApplesInBox, applesToSell, percentProfit)
        res.redirect(`/input/${identifier}`);
       } catch(error){
        next(error)
       }
    
    }

    async function getCalculations(req, res, next){
        try{
            const identifier = req.params.identifier
            console.log(identifier);
                let costPerApple = await packetPlanner.getCostPerApple(identifier);
                let numberOfPackets = await packetPlanner.getNumberOfPackets(identifier);
                let costPerPacket = await packetPlanner.getCostPerPacket(numberOfPackets,costPerApple);
                console.log(costPerPacket)
                let recommendedSellPrice = await packetPlanner.getRecommendedSellPrice(costPerPacket,identifier)
                console.log('number of packets:' + numberOfPackets);
            res.render('index', {
            costPerApple,
            numberOfPackets,
            costPerPacket,
            recommendedSellPrice
            })
        }catch(error){
            next(error)
        }
   
    }
    return{
        showIndex,
        inputValues,
        getCalculations,
    }
}

export default appleRoute