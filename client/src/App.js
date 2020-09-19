import React, { useState, useEffect, useMemo } from 'react';
import UserList from './components/userlist';
import Notification from './components/notification';
import io from "socket.io-client";
import {generate_name} from './word-list';
import {Icon, Button, Input} from 'semantic-ui-react';
import {buttonValues} from './constants';

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
});

function App() {
  // TODO: change default to false and set when enough people
  let [allUsers, setAllUsers] = useState([]);
  let [showNotification, setShowNotification] = useState(true);
  let [isFlagged, setIsFlagged] = useState(false);

  const initialName = useMemo(generate_name);
  let [name, setName] = useState(
      localStorage.getItem('displayName') || initialName
  );

  /**
   * When the user clicks outside of the input, save name into the local storage
   * and update the database accordingly
   */
  const saveName = (e) => {
      if (e.target.value === '') {
          setName(initialName);
          return;
      }
  }

  useEffect(() => {
    const fetchAllUsers = async () => {
      const allUsers = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: {name},
      });
      setAllUsers(allUsers);
    }
    fetchAllUsers();
  }, []);

  useEffect(() => {
    socket.emit("toggleFlag", name);
    console.log("emit toggleFlag");
  }, [isFlagged]);

  useEffect(() => {
    socket.on('newUserList', data => console.log(data));
  });

  return (
    <div className='app'>
      <div className="container">
        <h1 className='title'>
          vlounge
        </h1>
        <section className='users-container'>
          <div className='name-container'>
            <div>
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
            </div>    
            <Button 
              className='flag-button'
              onClick={() => setIsFlagged(!isFlagged)}
            >
              <Icon name={buttonValues[isFlagged].icon}/>
              {buttonValues[isFlagged].text}
            </Button>
          </div>
          <UserList users={userList}/>
        </section>
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
