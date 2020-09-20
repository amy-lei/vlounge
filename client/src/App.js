import React, { useState, useEffect, useMemo } from 'react';
import UserList from './components/userlist';
import Notification from './components/notification';
import Player from './components/player';
import io from "socket.io-client";
import {generate_name} from './word-list';
import {Icon, Button, Input} from 'semantic-ui-react';
import {buttonValues} from './constants';

import './styles/app.css';
import 'semantic-ui-css/semantic.min.css'

// connecting to server
let endpoint = "http://localhost:5000";
let socket = io.connect(`${endpoint}`);

function App() {
  // TODO: change default to false and set when enough people
  let [allUsers, setAllUsers] = useState([]);
  let [showNotification, setShowNotification] = useState(true);
  let [isFlagged, setIsFlagged] = useState(false);
  let [userList, setUserList] = useState([ 
    {name: "test person", is_flagged: false}
  ]);


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
    const initUser = async () => {
      const allUsers = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name}),
      });
      const uniqueName = await allUsers.json();
      console.log(uniqueName);
      setName(uniqueName.name);
    }
    initUser();
  }, []);

  useEffect(() => {
    socket.emit("toggleFlag", name);
    console.log("emit toggleFlag");
    console.log(name);
  }, [isFlagged]);

  useEffect(() => {
    socket.on('newUser', data => console.log(data));
    socket.on('updateUsers', data => console.log(data));
  });

    //console.log("final list")
    //console.log(userList)

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
          <Player/>
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
