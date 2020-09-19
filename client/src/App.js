import React, { useState, useEffect } from 'react';
import UserList from './components/userlist';
import Notification from './components/notification';
import io from "socket.io-client";

import './styles/app.css';
import 'semantic-ui-css/semantic.min.css'

// connecting to server
let endpoint = "http://localhost:5000";
let socket = io.connect(`${endpoint}`);

function App() {
  // TODO: change default to false and set when enough people
  let [showNotification, setShowNotification] = useState(true);
  let [userList, setUserList] = useState([ 
    {name: "test person", is_flagged: false}
  ]);

    socket.on("justConnected", (data) => {
        var tempList = [];
        for (var user of data) {
            tempList.push(JSON.parse(user));
        }
        setUserList(tempList);
        console.log("got list of users");
        console.log(userList);
    });

    socket.on("updateUser", (data) => {
        var userToUpdate = JSON.parse(data);
        var newUser = 1;
        for (let i = 0; i < userList.length; i++) {
            var user = userList[i];
            if (user.name == userToUpdate.name) {
                setUserList((prev_state) => userList[i] = userToUpdate);
                newUser = 0;
            }
        }
        if (newUser == 1) {
            setUserList((prev_state) => prev_state.push(userToUpdate));
        }
        console.log("update list of users");
        console.log(userList)
    });

  // useEffect(() => {
  //   if (showNotification) {
  //     const audio = new Audio('./sound.mp3');
  //     audio
  //       .play()
  //       .catch(err => console.log(err))
  //     console.log('played');
  //   }
  // }, [showNotification]);

    console.log("final list")
    console.log(userList)

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
