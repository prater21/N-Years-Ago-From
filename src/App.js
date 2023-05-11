import { Fragment, useState } from 'react';
import './App.css';
import Body from './components/Body';
import Header from './components/Header';

function App() {
  const [channelId, setChannelId] = useState("");
  const [channelImg, setChannelImg] = useState("");
  const [apiError, setApiError] = useState(false);

  const setChId = (chId) => {
    setChannelId(chId);
  }
  const setChImg = (chImgSrc) => {
    setChannelImg(chImgSrc);
  }
  const ErrorHandler = () => {
    setApiError(true);
  }
  return (
    <Fragment>
      <Header setChannelId={setChId} ErrorHandler={ErrorHandler} setChannelImgSrc={setChImg} />
      {!apiError && <Body channelId={channelId} ErrorHandler={ErrorHandler} channelImgSrc={channelImg} />}
      {apiError && <div className='error'>
        <h2>Api 할당량이 다 찼습니다. 내일 다시 시도해주세요!</h2>
      </div>}
    </Fragment >
  );
}

export default App;
