import React, { useState, useEffect, useMemo } from 'react';
import UserList from './components/userlist';
import Notification from './components/notification';
import Player from './components/player';
import socketIOClient from "socket.io-client";
import {generate_name} from './word-list';
import {Icon, Button, Input} from 'semantic-ui-react';
import {buttonValues} from './constants';

import './styles/app.css';
import 'semantic-ui-css/semantic.min.css'

// connecting to server
let endpoint = "http://localhost:5000";
const socket = socketIOClient(`${endpoint}`);

function App() {
  // TODO: change default to false and set when enough people
  let [showNotification, setShowNotification] = useState(false);
  let [isFlagged, setIsFlagged] = useState(false);
  let [userList, setUserList] = useState([]);

  const initialName = useMemo(generate_name);
  let [name, setName] = useState(
    localStorage.getItem('displayName') || initialName
    );
  let [formerName, setFormerName] = useState(name);
  let [count, setCount] = useState(0);
  let [numHearts, setNumHearts] = useState(0);
  let [inputTimer, setInputTimer] = useState(null);

  const heartReact = () => {
    const delay = 3000;
    setCount(count + 1);
    setNumHearts(numHearts + 1);
    clearTimeout(inputTimer);
    setInputTimer(setTimeout(async()=>{
      const body = {numHearts};
      const res = await fetch('http://localhost:5000/api/hearts', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      });
      console.log(`Added ${count} hearts!`)
      const newNum = await res.json();
      setCount(0);
  }, delay));
  }

  /**
   * When the user clicks outside of the input, save name into the local storage
   * and update the database accordingly
   */
  const saveName = async (e) => {
      let name = e.target.value;
      if (name === formerName) {
        return;
      }
      if (name === '') {
          name = initialName;
      }
      const body = {formerName, name};
      const allUsers = await fetch('http://localhost:5000/api/name', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      });
      const res = await allUsers.json();
      setName(res.name);
      setFormerName(res.name);
  }

  /**
   * On initial load, fetch all current users and update name to be one that
   * doesn't conflict
   */
  useEffect(() => {
    socket.on('connect', () => {
      const initUser = async () => {
        const body = {name, socketId: socket.id};
        const allUsers = await fetch('http://localhost:5000/api/users', {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(body),
        });
        const res = await allUsers.json();
        setName(res.name);
        setUserList(res.allUsers);
      }
      initUser();
    });
  }, []);

  /**
   * Toggle status of flag and send to backend to be emitted and updated
   */
  const toggleFlag = async () => {
    setIsFlagged(!isFlagged);
    const body = {name};
    const allUsers = await fetch('http://localhost:5000/api/flag', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(body),
    });
    await allUsers.json();
  }

  /**
   * Update userlist, hearts, when someone flags, changes name, leaves or leaves hearts
   */
  useEffect(() => {
    socket.on('updateUsers', allUsers => {
      setUserList(allUsers);
    });

    socket.on('makeRoom', numFlagged => {
      setShowNotification(true)
      //console.log(numFlagged);
    });

    socket.on('userLeft', username => {
      const updatedList = userList.filter(u => u.name !== username);
      setUserList(updatedList);
    });

    socket.on('updateHearts', numHearts => setNumHearts(numHearts));
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
              className={`btn flag-button ${isFlagged ? 'outline':''}`}
              onClick={toggleFlag}
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
        <Button
          circular
          className='heart-button btn'
          onClick={heartReact}
        >
          <Icon name='heart'/>
          {numHearts}
        </Button>
      </div>
    </div>
  );
}

export default App;
