var express = require('express');
var cors = require('cors')
var bodyParser = require('body-parser');
const {
  BEforFE_SERVICE_PORT,
} = require('../config');
const { subscribe } = require('./subscribers')

const SERVICE_NAME = 'BEforFE'

let orderStatus = 'NONE'
let deliveryStatus = 'NONE'

const callbacks = {
  newOrder: function () {
    console.log('order status change')
    orderStatus = 'ACCEPTED'
  },
  newDelivery: function() {
    console.log('delivery status change')
    deliveryStatus = 'ACCEPTED'
  }
}

const handleRealTime = async function(req, res) {
  const rID = req.query.rid
  subscribe(rID, callbacks)
    res.set({
      'Cache-Control': 'no-cache',
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive'
    });
    res.flushHeaders();

    while (true) {
      await new Promise(resolve => setTimeout(resolve, 1000));

      res.write(`data: ${JSON.stringify({orderStatus, deliveryStatus})}\n\n`);
    }
}

const handleClear = function(req, res) {
  orderStatus = 'NONE';
  deliveryStatus = 'NONE';
  res.send();
}

var app = express();
app.use(cors())
app.use(bodyParser.json());

app.get('/real_time_status', handleRealTime);
app.post('/clear', handleClear);

app.listen(BEforFE_SERVICE_PORT, () => {
  console.log(`${SERVICE_NAME} up at PORT: ${BEforFE_SERVICE_PORT}`);
});
