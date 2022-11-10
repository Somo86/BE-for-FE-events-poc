var kafka = require('kafka-node'),
  Consumer = kafka.Consumer
  const {
    KAFKA_HOST,
  } = require('../config');
const kafkaClient = new kafka.KafkaClient({ kafkaHost: KAFKA_HOST });
const { NEW_ORDER_TOPIC_FOR_FE } = require('../restaurantService/events')
const { NEW_DELIVERY_ORDER_TOPIC_FOR_FE } = require('../deliverService/events')

const eventsToSubscribe = [
  {topic: NEW_ORDER_TOPIC_FOR_FE },
  {topic: NEW_DELIVERY_ORDER_TOPIC_FOR_FE },
]
const options = {
  autoCommit: true,
  fetchMaxWaitMs: 1000,
  fetchMaxBytes: 1024 * 1024,
};

const subscribe = function(id, callbacks) {
  const consumer = new Consumer(kafkaClient, eventsToSubscribe, options)
  consumer.on('message', function(data) {
    console.log(data.topic)
    if(data.topic === NEW_ORDER_TOPIC_FOR_FE) {
      callbacks.newOrder()
    } else if(data.topic === NEW_DELIVERY_ORDER_TOPIC_FOR_FE) {
      callbacks.newDelivery()
    }
  })
}

module.exports = {
  subscribe
}