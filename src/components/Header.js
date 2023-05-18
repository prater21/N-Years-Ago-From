/**
 * header component
 */

import { useRef, useState } from "react";
import axios from "axios";
import Spinner from "react-spinners/ClipLoader";

import "./Header.css"

const Header = ({ setChannelId, setChannelImgSrc, ErrorHandler }) => {

    const searchInput = useRef();
    const [displaySearch, setDisplaySearch] = useState(false);
    const [blurOn, setBlurOn] = useState(false);
    const [searchResult, setSearchResult] = useState([]);
    const [youtuber, setYoutuber] = useState(null);
    const [loading, setLoading] = useState(false);

    const submitHandler = async (event) => {
        event.preventDefault();
        setLoading(true);

        await axios.get("https://www.googleapis.com/youtube/v3/search", {
            params: {
                key: process.env.REACT_APP_API_KEY,
                part: "snippet",
                type: "channel",
                q: searchInput.current.value
            }
        }).then(response => {
            // console.log(response.data)
            setSearchResult(response.data.items);

        }).catch(err => {
            console.log("error", err);
            ErrorHandler();
        })
        setLoading(false);
    }

    return <div className="header">
        <div className="header__top">
            <div className="header__topLeft">
                <img className="header__icon" src={process.env.PUBLIC_URL + '/img/youtubeIcon.png'} alt="" />
                <h1 className="header__title">N Years Ago From</h1>
            </div>
            <form className="header__topRight" onSubmit={submitHandler}>
                <input
                    className="header__searchInput"
                    ref={searchInput}
                    onChange={() => { setSearchResult([]) }}
                    onMouseOver={() => { setBlurOn(false) }}
                    onFocus={() => { setDisplaySearch(true); }}
                    onBlur={() => { if (blurOn) { setDisplaySearch(false); } }}
                    type="text"
                />
                {displaySearch &&
                    <ul
                        className="header__searchResults"
                        onMouseOver={() => { setBlurOn(false) }}
                        onMouseOut={() => { setBlurOn(true) }}>
                        {!loading &&
                            searchResult.map(result =>
                                <li className="header__searchResult"
                                    onClick={() => {
                                        setChannelId(result.snippet.channelId);
                                        setChannelImgSrc(result.snippet.thumbnails.high.url);
                                        setYoutuber(
                                            {
                                                imgSrc: result.snippet.thumbnails.default.url,
                                                title: result.snippet.channelTitle,
                                                description: result.snippet.description
                                            });
                                        setDisplaySearch(false);
                                    }}>
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
                        <p className="header__searchClose" onClick={() => { setDisplaySearch(false); }}>Close</p>
                    </ul>}
                <button className="header__searchIcon" >
                    <img width={"20px"} src={process.env.PUBLIC_URL + '/img/searchIcon.png'} alt="" />
                </button>
            </form>
        </div>
        {!youtuber && <div className="header__noProfile">
            <h2>Pick your Youtuber</h2>
        </div>}
        {youtuber && <div className="header__profile">
            <img className="header__profileImg" src={youtuber.imgSrc} alt="" />
            <div>
                <p className="header__profileName">{youtuber.title}</p>
                <p className="header__description">{youtuber.description}</p>
            </div>
        </div>}
        <hr className="header__line"></hr>
    </div >
}

export default Header;