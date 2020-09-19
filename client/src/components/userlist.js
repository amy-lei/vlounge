import React, {useEffect, useState, useMemo} from 'react';
import {Icon, Button, Input} from 'semantic-ui-react';
import {generate_name} from '../word-list';
import io from "socket.io-client";

import '../styles/users.css'

// connecting to server
let endpoint = "http://localhost:5000";
let socket = io.connect(`${endpoint}`);


const buttonValues = {
    false: {
        text: "Ready to chat!",
        icon: "flag"
    },
    true: {
        text: "Back to chillin'",
        icon: "hand point down"
    },
};

var name = Math.floor((Math.random() * 100) + 1).toString()

// when connection is established
socket.on('connect', () => {
    console.log("connected");
    // TODO: tell server to tell everyone else that you joined
    socket.emit("justConnected");
    console.log("emit justConnected");
    socket.emit("newUser", name);
    console.log("emit newUser");
     
});


function UserList(props) {
    const {users} = props;
    const initialName = useMemo(generate_name);
    
    let [isFlagged, setIsFlagged] = useState(false);
    let [name, setName] = useState(
        localStorage.getItem('displayName') || initialName
    );
  

    const saveName = (e) => {
        localStorage.setItem('displayName', e.target.value);
        // TODO: send to api to update everyone else that name has changed
    }

    // catch changes
    useEffect(() => {
        socket.emit("toggleFlag", name);
        console.log("emit toggleFlag");
    }, [isFlagged]);

    const renderedUsers = users.map(user => <User {...user}/>)
    return (

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
            <div className='users'>
                {renderedUsers}
            </div>
        </section>

    );
}

function User(props) {
    const {name, is_flagged} = props;

    return (
        <div className='user'>
            <Icon 
                name={is_flagged ? 'flag' : 'circle'}
                className={`user-icon ${is_flagged ? 'flagged':''}`}            
            />
            {name}
        </div>
    )
}

export default UserList;
