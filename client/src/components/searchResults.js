import React, {useState} from 'react';
import "../styles/app.css";

function SearchResults(props) {
    const RESULTS = props.results;
    console.log(RESULTS);
    return (
        <div>
        {RESULTS.map(v =>
            <div className="search-result">
              <img src={v.thumbnail} />
              <div id="video-text">
                <div><b>{v.title}</b></div>
                <div>{v.channel}</div>
              </div>
            </div>
        )}
        </div>
    );
}

export default SearchResults;
