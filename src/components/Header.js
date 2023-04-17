import "./Header.css"

const Header = () => {
    return <div className="header">
        <img className="header__img" src={process.env.PUBLIC_URL + '/img/chim-header.png'} alt="" />
        <div className="header__profile">
            <img className="header__profileImg" src={process.env.PUBLIC_URL + '/img/chim-profile.jpeg'} alt="" />
            <div>
                <p className="header__name">침착맨</p>
                <p className="header__description">반갑습니다. 오늘도 즐거운 날입니다.</p>
            </div>
        </div>
        <hr className="header__line"></hr>
    </div>
}

export default Header;