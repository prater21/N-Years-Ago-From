/**
 * body component
 */
import { useEffect, useState } from "react";
import axios from "axios";
import Spinner from "react-spinners/ClipLoader";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Body.css"

const Body = ({ channelId, channelImgSrc, ErrorHandler }) => {
    // date variable
    const [date, setDate] = useState(new Date());
    const [dateEnd, setDateEnd] = useState(null);
    // video data variable
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const publishData = [];

    const [day, setDay] = useState(1);

    useEffect(() => {
        setVideos([]);
    }, [channelId])

    // get video data
    const getData = async (publishData) => {
        const _videos = [];
        setLoading(true);

        //get data from youtube data API
        for (const pub of publishData) {
            // console.log(pub[0], pub[1]);
            await axios.get("https://www.googleapis.com/youtube/v3/search", {
                params: {
                    key: process.env.REACT_APP_API_KEY,
                    part: "snippet",
                    channelId: channelId,
                    type: "video",
                    publishedAfter: pub[0],
                    publishedBefore: pub[1],
                    order: "date"
                }
            }).then(response => {
                const _year = pub[0].slice(0, 4);
                _videos.push({ year: _year, items: response.data.items })

            }).catch(err => {
                console.log("error", err);
                ErrorHandler();
            })
        }
        setVideos(_videos);
        setLoading(false);
    }

    //set video published date
    const getPublishDate = (year, iter, start, end) => {
        for (let i = 0; i < iter; i++) {
            let pubAfter = year + "-" + (start.getMonth() + 1) + "-" + start.getDate() + "T00:00:00Z";
            let pubBefore = year + "-" + (end.getMonth() + 1) + "-" + end.getDate() + "T23:59:59Z";
            year -= 1;
            publishData.push([pubAfter, pubBefore]);
        }
    }

    // set date when datepicker clicked
    const dateChangeHandler = (date) => {
        if (channelId) {
            setDate(date);
            let start = new Date(date);
            let end = new Date(date);
            end.setDate(date.getDate() + (day - 1))
            setDateEnd(end);
            if (date.getMonth() === 1 && date.getDate() === 28) {   // 29 FEB
                getPublishDate(date.getYear(), 1, start, end);
            }
            else if (date < new Date()) {
                getPublishDate(2023, 7, start, end);
            }
            else {
                getPublishDate(2022, 6, start, end);
            }
            getData(publishData);
        }
    }

    const daySelect = (e) => {
        let _day = parseInt(e.target.value);
        setDay(_day);
    }

    return (
        <div className="body">
            <div className="body__title">
                <p>N Years Ago From...</p>
                <div className="body__select">
                    <div className="body__datePicker" >
                        <DatePicker selected={date} onChange={(date) => dateChangeHandler(date)} />
                    </div>
                    <select className="body__daySelect" onChange={daySelect}>
                        <option value="1">1일</option>
                        <option value="7">7일</option>
                        <option value="14">14일</option>
                        <option value="30">30일</option>
                    </select>
                </div>
            </div>

            {!loading && videos.length === 0 && <div className="body__container">
                <h3>Choose a date</h3>
            </div>}

            {!loading && <div className="body__container">
                <ul className="body__content">
                    {videos.map(data => (
                        data.items.length ? (
                            // exist video data
                            <li className="body__videos" key={data.items[0]?.id.videoId}>
                                <p className="body__year">{data.year}년 {date.getMonth() + 1}월 {date.getDate()}일 ~ {dateEnd.getMonth() + 1}월 {dateEnd.getDate()}일 </p>
                                <div className="body__video" >
                                    {data.items?.map(item =>
                                        <div className="body__player">
                                            <iframe id={item.id.videoId} title={`video-${item.id.videoId}`} type="text/html" width="320" height="180"
                                                src={`http://www.youtube.com/embed/${item.id.videoId}`}
                                                frameborder="0" allowFullScreen>
                                            </iframe>
                                        </div>
                                    )}
                                </div>
                                <hr />
                            </li>) : (
                            //no video data
                            <li key={data.year} className="body__empty" >
                                <p className="body__year">{data.year}년 {date.getMonth() + 1}월 {date.getDate()}일 ~ {dateEnd.getMonth() + 1}월 {dateEnd.getDate()}일</p>
                                <img className="body__emptyImg" src={channelImgSrc} alt="no video img" />
                                <hr />
                            </li>
                        ))

                    )}
                </ul>
            </div>}

            {loading &&
                //loading spinner
                <div className="body__loading">
                    <Spinner
                        color="white"
                        loading={loading}
                        size={30}
                        speedMultiplier={0.7}
                    />
                </div>}
        </div >
    )
}

export default Body;