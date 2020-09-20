import React, {useState, useEffect} from 'react';
import { Button, Header, Image, Modal, Input, Icon } from 'semantic-ui-react';

import SearchResults from "./searchResults"

function PlaylistModal() {
    const URL = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=5&&key=AIzaSyA7hHykojvvVc7xnpC4Sl_sPDhDCA40cdQ&q=";

    const [open, setOpen] = useState(false);
    const [readySearch, setReadySearch] = useState(false);
    const [readySubmit, setReadySubmit] = useState(false);
    const [textInput, setTextInput] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    
    useEffect(() => {
        console.log(textInput.length);
        if (textInput.length === 0) { setReadySearch(false); }
        else { setReadySearch(true); }
    }, [textInput]);

    const search = (e) => {
        e.preventDefault();
        if (!readySearch) { return; }
        const query = e.target.value.trim();
        const getVideos = async (query) => {
            console.log("now in async, searching for " + query);
            const res = await fetch(URL+query, {
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
    
    return (
        <Modal
            onOpen={() => setOpen(true)}
            onClose={() => setOpen(false)}
            open={open}
            trigger={<Button>Add to playlist</Button>}
        >
          <Modal.Header>Add to Playlist</Modal.Header>
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
            <SearchResults results={searchResults} />
          </Modal.Content>
          <Modal.Actions>
            <Button color='black'
                    onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
                content="Add"
                labelPosition='right'
                icon='checkmark'
                onClick={() => setOpen(false)}
                positive
                disabled={!readySubmit}
            />
          </Modal.Actions>
        </Modal>
    )
}

export default PlaylistModal;
