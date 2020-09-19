import React, { useState, useEffect } from 'react';
import UserList from './components/userlist';
import Notification from './components/notification';
import io from "socket.io-client";

import './styles/app.css';
import 'semantic-ui-css/semantic.min.css'

// connecting to server
let endpoint = "http://localhost:5000";
let socket = io.connect(`${endpoint}`);

var userList = [
];

socket.on("justConnected", (data) => {
    userList = [];
    for (var user of data) {
        userList.push(JSON.parse(user));
    }
});

socket.on("updateUser", (data) => {
    var userToUpdate = JSON.parse(data);
    var newUser = 1;
    for (let i = 0; i < userList.length; i++) {
        var user = userList[i];
        if (user.name == userToUpdate.name) {
            userList[i] = userToUpdate;
            newUser = 0;
        }
    }
    if (newUser == 1) {
        userList.push(userToUpdate);
    }
    //console.log("test")
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
        <UserList users={userList}/>
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
