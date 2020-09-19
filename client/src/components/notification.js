import React, {useState, useMemo, useEffect} from 'react';
import {MEETING_ID, BASE_URL} from '../constants';
import {Icon} from 'semantic-ui-react';

import '../styles/notification.css';

function Notification({setShowNotification}) {
    return (
        <div className='notification-container'>
            <button onClick={() => setShowNotification(false)}>
                X
            </button>
            <p>
                A room is ready! Click 
                <a href={BASE_URL + MEETING_ID} target='_blank'> here </a> 
                to join the call
            </p>
        </div>
    );
}

export default Notification;