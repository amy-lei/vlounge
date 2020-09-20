import React, {useEffect} from 'react';
import PlaylistModal from './playlistModal';

function Player() {
    /* window.open("https://music.youtube.com/watch?v=6yWBK8Hp4B8&list=PLiV4rmppLa4bsAEhAxBgUF8oc7gtDfp0z"); */

    return (
        <div className='player-container'>
          <iframe id="player" width="100%" height="100px" src="https://www.youtube.com/embed/videoseries?list=PLiV4rmppLa4bsAEhAxBgUF8oc7gtDfp0z" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
          <center>Want to collaborate on this playlist? Click <a href="https://www.youtube.com/playlist?list=PLiV4rmppLa4bsAEhAxBgUF8oc7gtDfp0z">here</a>!</center>
          <PlaylistModal />
        </div>
    )
}

export default Player;
