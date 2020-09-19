import React, {useState} from 'react';
import {Input, Button} from 'semantic-ui-react';
import Lounge from './components/lounge';

import './styles/app.css';
import 'semantic-ui-css/semantic.min.css'

function App() {
  let [name, setName] = useState('');
  let [inLounge, setInLounge] = useState(false);

  if (inLounge) {
    return <Lounge/>;
  }

  return (
    <div className="app">
      <div className="container">
        <h1>
          vlounge
        </h1>
        <div className="name-input">
          <Input
            size='large'
            value={name}
            onChange={(e, {value}) => setName(value)}
            placeholder='Enter your name to join'
          />
          <Button
            circular
            size='large'
            icon='arrow right'
            onClick={() => setInLounge(true)}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
