var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var kafka = require('kafka-node');
var MongoClient = require('mongodb').MongoClient;
const {
  PRODUCER_CONFIG,
  KAFKA_HOST,
  ORCHESTATOR_SERVICE_PORT,
  MONGO_URL
} = require('../config');
const { getPartition, getID } = require('../utils')
const { post } = require('../httpRequester')
const { subscribe } = require('./subscribers')

const SERVICE_NAME = 'ORCHESTATOR'
const MONGO_COLLECTION = 'orders'
let orderCollection

var app = express();
const kafkaClient = new kafka.KafkaClient({ kafkaHost: KAFKA_HOST });
const producer = new kafka.Producer(kafkaClient, PRODUCER_CONFIG, getPartition);

const requestOrder = function(body) {
  // order to restaurant
  return post('http://localhost:3000/orders', body)
}

const handleMongoConnection = function(err, client) {
  if (err) return console.log(err);
  console.log(`mongo ${SERVICE_NAME} connected`)
  orderCollection = client.db().collection(MONGO_COLLECTION);
};

function startListener(deps) {
  deps.mongo.connect(MONGO_URL, handleMongoConnection)
}

async function createOrderHandler(req, res, next) {
  try {
    const id = getID()
    await requestOrder({...req.body, id})
    res.setHeader('Content-Type', 'application/json');
    res.json({ id });
  } catch (e) {
    res.sendStatus(500)
    res.send({ ok: false, error: e.message });
  }
}

app.use(bodyParser.json());
app.use(cors())

app.post('/orders/create', createOrderHandler);

app.listen(ORCHESTATOR_SERVICE_PORT, () => {
  console.log(`${SERVICE_NAME} up at PORT: ${ORCHESTATOR_SERVICE_PORT}`);
  startListener({ 
    mongo: MongoClient,
    kafka: producer
  });
  
  subscribe()
});
