var kafka = require('kafka-node'),
  Consumer = kafka.Consumer
  const {
    KAFKA_HOST,
  } = require('../config');
const kafkaClient = new kafka.KafkaClient({ kafkaHost: KAFKA_HOST });
const { NEW_ORDER_TOPIC } = require('../restaurantService/events')
const { NEW_DELIVERY_ORDER_TOPIC } = require('../deliverService/events')
const { post } = require('../httpRequester')

const eventsToSubscribe = [
  {topic: NEW_ORDER_TOPIC },
  {topic: NEW_DELIVERY_ORDER_TOPIC },
]
const options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
};
const consumer = new Consumer(kafkaClient, eventsToSubscribe, options)

const subscribe = function() {
  consumer.on('message', function(data) {
    if(data.topic === NEW_ORDER_TOPIC) {
      post('http://localhost:3002/deliver_order', JSON.parse(data.value))
    }
  })
}

module.exports = {
  subscribe
}