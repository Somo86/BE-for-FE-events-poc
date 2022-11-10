const NEW_DELIVERY_ORDER_TOPIC = 'NEW_DELIVERY_ORDER_TOPIC'
const NEW_DELIVERY_ORDER_TOPIC_FOR_FE = 'NEW_DELIVERY_ORDER_TOPIC_FOR_FE'

const events = {
  newOrder: {
    schema: {
      topic: NEW_DELIVERY_ORDER_TOPIC,
      message: ''
    }
  }
}

const setNewOrderEvent = function(message) {
  return {
    ...events.newOrder.schema,
    messages: JSON.stringify(message),
    key: message.id
  }
}

const setNewOrderEventForFE = function(message) {
  return {
    ...events.newOrder.schema,
    messages: JSON.stringify(message),
    key: message.id,
    topic: NEW_DELIVERY_ORDER_TOPIC_FOR_FE,
  }
}

module.exports = {
  NEW_DELIVERY_ORDER_TOPIC,
  NEW_DELIVERY_ORDER_TOPIC_FOR_FE,
  setNewOrderEvent,
  setNewOrderEventForFE
}