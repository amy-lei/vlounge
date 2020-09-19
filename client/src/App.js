import React, { useState, useEffect } from 'react';
import UserList from './components/userlist';
import Notification from './components/notification';
import io from "socket.io-client";

import './styles/app.css';
import 'semantic-ui-css/semantic.min.css'

// connecting to server
let endpoint = "http://localhost:5000";
let socket = io.connect(`${endpoint}`);

const USERS = [
  { name: "alice", is_flagged: false},
];

socket.on("updateUser", (data) => {
    //USERS.push(JSON.parse(data))
    console.log("test")
});

function App() {
  // TODO: change default to false and set when enough people
  let [showNotification, setShowNotification] = useState(true);
  
  // useEffect(() => {
  //   if (showNotification) {
  //     const audio = new Audio('./sound.mp3');
  //     audio
  //       .play()
  //       .catch(err => console.log(err))
  //     console.log('played');
  //   }
  // }, [showNotification]);

  return (
    <div className='app'>
      <div className="container">
        <h1 className='title'>
          vlounge
        </h1>
        <UserList users={USERS}/>
        { showNotification &&
          <Notification 
            setShowNotification={setShowNotification}
          />
        }
      </div>
    </div>
  );
}

export default App;
