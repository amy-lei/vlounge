import React, {useState, useMemo} from 'react';
import {Input} from 'semantic-ui-react';
import UserList from './components/userlist';
import {generate_name} from './word-list';
import io from "socket.io-client";

import './styles/app.css';
import 'semantic-ui-css/semantic.min.css'

// connecting to server
let endpoint = "http://localhost:5000";
let socket = io.connect(`${endpoint}`);

const FAKE_PEOPLE = [
  { name: "Amy Lei", is_flagged: false},
  { name: "Amy Lei", is_flagged: true},
  { name: "Amy Lei", is_flagged: false},
  { name: "Amy Lei", is_flagged: false},
  { name: "Amy Lei", is_flagged: false},
  { name: "Amy Lei", is_flagged: true},
  { name: "Amy Lei", is_flagged: true},
  { name: "Amy Lei", is_flagged: false},
  { name: "Amy Lei", is_flagged: true},
  { name: "Amy Lei", is_flagged: false},
];


function App() {
  const initialName = useMemo(generate_name);
  let [name, setName] = useState(initialName);

  // TODO: send to api to update everyone else that name has changed
  const saveName = (e) => {}

  return (
    <div className='app'>
      <div className="container">
        <h1 className='title'>
          vlounge
        </h1>
        <label>
          Display name:
        </label>
        <Input
          size='big'
          value={name}
          onChange={(e, {value}) => setName(value)}
          onBlur={saveName}
          placeholder='Enter your name'
          className='name'
        />
        <UserList users={FAKE_PEOPLE}/>
      </div>
    </div>
  );
}

export default App;
