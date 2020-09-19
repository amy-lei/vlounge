import React, {useState, useMemo} from 'react';
import {Icon} from 'semantic-ui-react';

import '../styles/notification.css';

function Notification({link, setShowNotification}) {
    return (
        <div className='notification-container'>
            <button onClick={() => setShowNotification(false)}>
                X
            </button>
                <p>A room is ready! Click <a>here</a> to join the call</p>
        </div>
    );
}

export default Notification;