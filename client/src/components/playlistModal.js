import React, {useState, useEffect} from 'react';
import { Button, Header, Image, Modal, Input, Icon } from 'semantic-ui-react';

import SearchResults from "./searchResults"

function PlaylistModal() {
    const GET_URL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&&key=AIzaSyA7hHykojvvVc7xnpC4Sl_sPDhDCA40cdQ&q=";
    const POST_URL = "https://www.googleapis.com/youtube/v3/playlistItems?key=AIzaSyA7hHykojvvVc7xnpC4Sl_sPDhDCA40cdQ"
    const PLAYLIST_ID = "PLiV4rmppLa4bsAEhAxBgUF8oc7gtDfp0z";

    const [open, setOpen] = useState(false);
    const [readySearch, setReadySearch] = useState(false);
    const [readySubmit, setReadySubmit] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [index, setIndex] = useState(null);

    useEffect(() => {
        if (textInput.length === 0) { setReadySearch(false); }
        else { setReadySearch(true); }
    }, [textInput]);

    const search = (e) => {
        e.preventDefault();
        if (!readySearch) { return; }
        const query = e.target.value.trim();
        const getVideos = async (query) => {
            console.log("now in async, searching for " + query);
            const res = await fetch(GET_URL+query, {
                method: "GET",
                headers: {'Accept': 'application/json'},
            });
            const data = await res.json();
            const parsed = data.items.map(v => {
                return { id: v.id.videoId,
                         title: v.snippet.title,
                         channel: v.snippet.channelTitle,
                         thumbnail: v.snippet.thumbnails.default.url
                }
            });
            showResults(parsed);
        };
        getVideos(query);
    }

    const showResults = parsed => {
        setSearchResults(parsed);
    }
    
    const selectVideo = (i) => {
      setIndex(i);
      setReadySubmit(true);
    }

    const addVideo = async () => {
        console.log("in add video");
        fetch(POST_URL, {
            method: "POST",
            headers: { 'Accept': 'application/json',
                       'Authorization': 'Bearer 888670714689-hu29fem6najhk9h8b97i9tic407b7suc.apps.googleusercontent.com',
                       'Content-Type': 'application/json' },
            body: {
                "snippet": {
                    "playlistId": PLAYLIST_ID,
                    "position": 0,
                    "resourceId": {
                        "kind": "youtube#video",
                        "videoId": searchResults[index].id
                    }
                }
            }
        })
            .then(response => {
                console.log("RESPONSE: ", response.json());
            })
            .then(data => {
                console.log("SUCCESS DATA: ", data);
                setOpen(false);
            })
            .catch(error => {
                console.error("ERROR: ", error);
                setOpen(false);
            });
    }
    

    return (
        <Modal
            size='small'
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            open={open}
            trigger={<Button className='btn outline' floated='right'>Add to playlist</Button>}
        >
          <Modal.Content>
            <form>
              <Input placeholder="Search on YouTube..."
                     iconPosition="right"
                     fluid
                     onChange={e => {e.preventDefault();
                         setTextInput(e.target.value.trim())}}
                     onKeyPress={e => e.key === "Enter" && search(e)} 
              >
                <input />
                <Icon name="search" />
              </Input>
            </form>
            <SearchResults results={searchResults}
                           index={index}
                           setIndex={selectVideo}
            />
          </Modal.Content>
          <Modal.Actions>
            <Button color='black'
                    className='btn'
                    onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
                content="Add"
                className='btn'
                labelPosition='right'
                icon='checkmark'
                onClick={() => addVideo()}
                positive
                disabled={!readySubmit}
            />
          </Modal.Actions>
        </Modal>
    )
}

export default PlaylistModal;
