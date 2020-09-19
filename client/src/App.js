import React, { useState, useEffect } from 'react';
import UserList from './components/userlist';
import Notification from './components/notification';

import './styles/app.css';
import 'semantic-ui-css/semantic.min.css'


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

//const onClick = () => {
    //socket.emit("test", "hello")
//}

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
        <UserList users={FAKE_PEOPLE}/>
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
