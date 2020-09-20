import React, {useState} from 'react';
import "../styles/app.css";

function SearchResults(props) {
    const RESULTS = props.results;
    let {index, setIndex} = props;
    console.log(RESULTS);
    return (
        <div className='search-result-container'>
        {RESULTS.map((v, i) =>
            <div 
              className={`search-result ${i === index ? 'active':''}`}
              onClick={() => setIndex(i)}
            >
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
