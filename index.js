import express from 'express';
import {engine} from 'express-handlebars'
import bodyParser from 'body-parser';
import db from './db.js';
import applePacket from './js/apple-packet.js';
import appleRoute from './routes/applePacketRoutes.js';

const app = express();
const packetPlanner = applePacket(db)
const packetPlannerRoute = appleRoute(packetPlanner)
//body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//handlebars engine

app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('views', './views');

//public static
app.use(express.static('public'));

//route handlers
app.get('/', packetPlannerRoute.showIndex);
app.post('/input', packetPlannerRoute.inputValues);
app.get('/input/:identifier', packetPlannerRoute.getCalculations);






//local host 
const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});