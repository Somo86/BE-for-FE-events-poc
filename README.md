# Frontend Server Events
## Goal
This project is a workaround for managing FE state via Kafka Events, in order to have a real time application. **Just for learning purposes**.

### The approach
Several actors participate on this workaround
* Orchestator: Service responsable of organising the different services to achieve the goal. In this case is responsable of serving and order ID and initiate the restaurant order. Once receives a restaurant response (via Event), jumps to the second step and initiate communication with delivery service.
* Restaurant service: Receives the order, store the data and communicates using events.
* Delivery service: Receives the order, store the data and communicates using events.
* BEforFE: Dedicated BE for FE purposes. Responsable of listening multiple events and communicate the status of each via Server Events to the Frontend.

![Frontend Server Events diagram](/assets/diagram.png)
![Alt Text](/assets/example.gif)


## Setup

Make sure you have following on your local machine installed
>   docker - 18.03.1
>   docker-compose - 1.21.1
>   node - 9.9.0
>   npm - 5.6.0

Install Project

    npm install
    docker-compose up
    cd frontend / npm install

Set Projects up (different terminals)

    Restaurant service -> node src/restaurantService/index.js
    Delivery service -> node src/deliveryService/index.js
    Orchestator -> node src/orchestatos/index.js
    BE for FE -> node src/BEforFE/index.js
    Frontend -> cd frontend -> yarn start

Kafka UI

   Visit http://127.0.0.1:3030 to inspect your kafka broker, topics, partitions etc.
