var express = require('express');
var bodyParser = require('body-parser');
var kafka = require('kafka-node');
var MongoClient = require('mongodb').MongoClient;
const {
  PRODUCER_CONFIG,
  KAFKA_HOST,
  RESTAURANT_SERVICE_PORT,
  MONGO_URL
} = require('../config');
const {
  setNewOrderEvent,
  setNewOrderEventForFE
} = require('./events')
const { getPartition, timeout } = require('../utils');

const SERVICE_NAME = 'RESTAURANT'
const MONGO_COLLECTION = 'orders'

let orderCollection

var app = express();
const kafkaClient = new kafka.KafkaClient({ kafkaHost: KAFKA_HOST });
const producer = new kafka.HighLevelProducer(kafkaClient, PRODUCER_CONFIG, getPartition);

app.use(bodyParser.json());

const sendEvent = function(deps, events) {
  deps.kafka.send(events, function (err, data) {
    console.log(err);
    console.log(data);
  })
}

const insertOrder = async function(order, res) {
  const body = { ...order }
  try {
    await orderCollection.insertOne(order)
    res.sendStatus(200)
    const events = [
      {...setNewOrderEvent(body)},
      {...setNewOrderEventForFE(body)}
    ]
    await timeout(4000)
    sendEvent({ kafka: producer }, events)
  } catch(error) {
    console.log(error)
    //sendEvent({ kafka: producer }, {...setNewOrderEvent(body), ok: false})
    res.sendStatus(500)
  }
}

const handleMongoConnection = function(err, client) {
  if (err) return console.log(err);
  console.log(`mongo ${SERVICE_NAME} connected`)
  orderCollection = client.db().collection(MONGO_COLLECTION);
};

function startListener(deps) {
  deps.mongo.connect(MONGO_URL, handleMongoConnection)
}

async function produceRouteHandler(req, res, next) {
  try {
    insertOrder(req.body, res)
  } catch (e) {
    res.json({ ok: false, error: e.message });
  }
}

app.post('/orders', produceRouteHandler);

app.listen(RESTAURANT_SERVICE_PORT, () => {
  console.log(`${SERVICE_NAME} up`);
  startListener({ 
    mongo: MongoClient,
  });
});
