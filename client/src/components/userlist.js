import React, {useState, useMemo} from 'react';
import {Icon, Button, Input} from 'semantic-ui-react';
import {generate_name} from '../word-list';

import '../styles/users.css'

const buttonValues = {
    false: {
        text: "Ready to chat!",
        icon: "flag"
    },
    true: {
        text: "Back to chillin",
        icon: "hand point down"
    },
};

function UserList(props) {
    const {users} = props;
    const initialName = useMemo(generate_name);
    
    let [isFlagged, setIsFlagged] = useState(false);
    let [name, setName] = useState(initialName);
  
    // TODO: send to api to update everyone else that name has changed
    const saveName = (e) => {}

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