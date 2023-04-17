import "./Body.css"
import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import axios from "axios";
import Spinner from "react-spinners/ClipLoader";

const Body = () => {
    const [date, setDate] = useState(new Date());
    const [videos, setVideos] = useState([]);
    const [loading, setLoading] = useState(false);
    const publishData = [];


    const getData = async (publishData) => {
        const _videos = [];
        setLoading(true);
        //get data from youtube data API
        for (const pub of publishData) {
            await axios.get("https://www.googleapis.com/youtube/v3/search", {
                params: {
                    key: process.env.REACT_APP_API_KEY,
                    part: "snippet",
                    channelId: "UCUj6rrhMTR9pipbAWBAMvUQ",
                    type: "video",
                    publishedAfter: pub[0],
                    publishedBefore: pub[1]
                }
            }).then(response => {
                const _year = pub[0].slice(0, 4);
                _videos.push({ year: _year, items: response.data.items })

            }).catch(err => {
                console.log("error", err);
            })
        }
        setVideos(_videos);
        setLoading(false);
    }

    //set video published date
    const getPublishDate = (year, iter, today, tomorrow) => {
        for (let i = 0; i < iter; i++) {
            let pubAfter = year + "-" + (today.getMonth() + 1) + "-" + today.getDate() + "T00:00:00Z";
            let pubBefore = year + "-" + (tomorrow.getMonth() + 1) + "-" + tomorrow.getDate() + "T00:00:00Z";
            year -= 1;
            publishData.push([pubAfter, pubBefore]);
        }
    }

    const dateChangeHandler = (date) => {
        setDate(date);
        let today = new Date(date);
        let tomorrow = new Date(date);
        tomorrow.setDate(date.getDate() + 1)
        // 29 FEB
        if (date.getMonth() === 1 && date.getDate() === 28) {
            getPublishDate(date.getYear(), 1, today, tomorrow);
        }
        else if (date < new Date()) {
            getPublishDate(2023, 7, today, tomorrow);
        }
        else {
            getPublishDate(2022, 6, today, tomorrow);
        }
        getData(publishData);

    }

    return (
        <div className="body">
            <div className="body__title">
                <h1 >N년전 오늘의 침착맨</h1>
                <div className="body_datePicker" >
                    <DatePicker selected={date} onChange={(date) => dateChangeHandler(date)} />
                </div>
            </div>
            {!loading && <div className="body_container">
                <ul className="body__content">
                    {videos.map(data => (
                        data.items.length ? (
                            <li className="body_videos" key={data.items[0]?.id.videoId}>
                                <p className="body_year">{data.year}년 {date.getMonth() + 1}월 {date.getDate()}일</p>
                                <div className="body_video" >
                                    {data.items?.map(item =>
                                        <div className="body__player">
                                            <iframe id={item.id.videoId} title={`video-${item.id.videoId}`} type="text/html" width="400" height="225"
                                                src={`http://www.youtube.com/embed/${item.id.videoId}?enablejsapi=1&origin=http://localhost:3000`}
                                                frameborder="0" allowFullScreen>
                                            </iframe>
                                        </div>
                                    )}
                                </div>
                                <hr />
                            </li>) : (
                            <li key={data.year} className="body__empty" >
                                <p className="body_year">{data.year}년 {date.getMonth() + 1}월 {date.getDate()}일</p>
                                <img className="body__emptyImg" src={process.env.PUBLIC_URL + "/img/chim-no-video.png"} alt="no video img" />
                                <hr />
                            </li>
                        ))

                    )}
                </ul>
            </div>}
            {loading &&
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