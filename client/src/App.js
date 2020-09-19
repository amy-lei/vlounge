import React, { useState } from 'react';
import UserList from './components/userlist';
import Notification from './components/notification';
import io from "socket.io-client";

import './styles/app.css';
import 'semantic-ui-css/semantic.min.css'

// connecting to server
let endpoint = "http://localhost:5000";
let socket = io.connect(`${endpoint}`);

const FAKE_PEOPLE = [
  { name: "alice", is_flagged: false},
];

socket.on("updateUser", (data) => {
    //FAKE_PEOPLE.push({name: "test_person", is_flagged: false})
    console.log("test")
});

function App() {
  // TODO: change default to false and set when enough people
  let [showNotification, setShowNotification] = useState(true);
  let [googleMeetLink, setGoogleMeetLink] = useState('');

  return (
    <div className='app'>
      <div className="container">
        <h1 className='title'>
          vlounge
        </h1>
        <UserList users={FAKE_PEOPLE}/>
        { showNotification &&
          <Notification 
            link={googleMeetLink} 
            setShowNotification={setShowNotification}
          />
        }
      </div>
    </div>
  );
}

export default App;
