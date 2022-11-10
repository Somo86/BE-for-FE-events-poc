import { Wizard } from './Wizard'
import { useState, useEffect } from 'react'
import './App.css';

function App() {
  const [reqID, setreqID] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3003/clear', {
      method: 'POST'
    })
  }, [])

  const onClick = async () => {
    const response = await fetch('http://localhost:3001/orders/create', {
      method: 'POST',
      body: {
        "operation": "order",
        "payment": true
      }
    })
    const { id } = await response.json()
    setreqID(id)
  }

  return (
    <div className="App">
      <header className="App-header">
        { reqID && <Wizard reqID={reqID} /> }
        { !reqID && (
          <>
            <div>
              <kor-input label="Dish" value="French potatoes" readonly></kor-input>
              <kor-input label="Number" value="1" type="number" readonly></kor-input>
            </div>
            <kor-divider orientation="horizontal" spacing="l"></kor-divider>
            <div>
              <kor-button onClick={onClick} label="Submit your order"></kor-button>
            </div>
          </>
        )}
      </header>
    </div>
  );
}

export default App;
