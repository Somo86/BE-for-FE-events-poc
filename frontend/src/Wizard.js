import { useEffect, useState } from 'react'

export const Wizard = ({ reqID }) => {
  const [status, setStatus] = useState({
    starting: true, 
    restaurant: false, 
    delivery: false, 
  })

  useEffect(() => {
    const eventSource = new EventSource(`http://localhost:3003/real_time_status?rid=${reqID}`);
    eventSource.onmessage = (e) => {
      const data = JSON.parse(e.data)
      if(data.orderStatus === 'ACCEPTED' && data.deliveryStatus === 'NONE') {
        setStatus({
          ...status, 
          restaurant: true,
          starting: false
        });
      } else if(data.deliveryStatus === 'ACCEPTED') {
        setStatus({
          ...status, 
          delivery: true,
          starting: false
        })
      }
    };
    eventSource.onerror = (e) => console.log(e);
    return () => {
      eventSource.close();
    };
  }, [reqID])

  console.log(status.restaurant)
  
  return (
    <>
      <h5>Order details: {reqID}</h5>
      <kor-stepper>
        <kor-stepper-item
          label="Order"
          info="order send"
          active={status.starting ? true : undefined}
          icon="shopping_basket"
        ></kor-stepper-item>
        <kor-stepper-item 
          label="Restaurant" 
          info={status.restaurant ? 'order confirmed' : !status.delivery ? 'pending...' : 'order confirmed'}
          active={status.restaurant ? true : undefined}
          icon="restaurant"
          ></kor-stepper-item>
        <kor-stepper-item 
          label="Delivery" 
          info={status.delivery ? 'order on road' : 'pending...'} 
          active={status.delivery ? true : undefined}
          icon="directions_bike"
        ></kor-stepper-item>
      </kor-stepper>
    </>
  );
}