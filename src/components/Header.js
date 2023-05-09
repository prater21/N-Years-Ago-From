/**
 * header component
 */

import { useRef, useState } from "react";
import axios from "axios";
import Spinner from "react-spinners/ClipLoader";

import "./Header.css"

const Header = ({ setChannelId, ErrorHandler }) => {

    const youtubetInput = useRef();
    const [displaySearch, setDisplaySearch] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [youtuber, setYoutuber] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);
        console.log(youtubetInput.current.value);
        await axios.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
                key: process.env.REACT_APP_API_KEY,
                part: "snippet",
                type: "channel",
                q: youtubetInput.current.value
            }
        }).then(response => {
            console.log(response.data)
            setSearchResult(response.data.items);

        }).catch(err => {
            console.log("error", err);
            ErrorHandler();
        })
        setLoading(false);
    }

    return <div className="header">
        <div className="header__top">
            <img className="header__icon" src={process.env.PUBLIC_URL + '/img/youtubeIcon.png'} alt="" />
            <p className="header__title">N Years Ago From</p>
            <form onSubmit={submitHandler}>
                <input ref={youtubetInput} onChange={() => { setSearchResult([]) }} onFocus={() => { setDisplaySearch(true); }} onBlur={() => { setDisplaySearch(false); }} type="text" id="youtuber" className="header__input" />
                {displaySearch &&
                    <ul className="header__searchResults">
                        {!loading &&
                            searchResult.map(result => <li className="header__searchResult" onClick={() => { setChannelId(result.snippet.channelId); setYoutuber({ imgSrc: result.snippet.thumbnails.default.url, title: result.snippet.channelTitle, description: result.snippet.description }); setDisplaySearch(false); }}>
                                <img width={"40px"} src={result.snippet.thumbnails.default.url} alt="" />
                                <p> {result.snippet.channelTitle}</p>
                            </li>)
                        }
                        {loading &&
                            <div className="header__spiner">
                                <Spinner
                                    color="grey"
                                    loading={loading}
                                    size={20}
                                    speedMultiplier={0.7}
                                />
                            </div>}
                    </ul>}

                <button>search</button>
            </form>
        </div>

        {!youtuber && <div className="header__noProfile">
            <h2>Pick your Youtuber</h2>
        </div>}
        {youtuber && <div className="header__profile">
            <img className="header__profileImg" src={youtuber.imgSrc} alt="" />
            <div>
                <p className="header__name">{youtuber.title}</p>
                <p className="header__description">{youtuber.description}</p>
            </div>
        </div>}
        <hr className="header__line"></hr>
    </div>
}

export default Header;