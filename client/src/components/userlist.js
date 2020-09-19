import React from 'react';
import {Icon} from 'semantic-ui-react';

import '../styles/users.css'

function UserList(props) {
    const {users} = props;
    const renderedUsers = users.map(user => <User {...user}/>)
    return (
        <div className='users'>
            {renderedUsers}
        </div>
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