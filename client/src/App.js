import React, {useState} from 'react';
import {Input, Button} from 'semantic-ui-react';
import Lounge from './components/lounge';
import io from "socket.io-client";

import './styles/app.css';
import 'semantic-ui-css/semantic.min.css'

// connecting to server
let endpoint = "http://localhost:5000";
let socket = io.connect(`${endpoint}`);

function App() {
  let [name, setName] = useState('');

  const saveName = (e) => {}

  return (
    <div className='app'>
      <div className="container">
        <h1 className='title'>
          vlounge
        </h1>
        <Input
          size='large'
          value={name}
          onChange={(e, {value}) => setName(value)}
          onBlur={saveName}
          placeholder='Enter your name to join'
          className='name'
        />
      </div>
    </div>
  );
}

export default App;
