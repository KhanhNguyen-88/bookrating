import classNames from "classnames/bind";
import style from "./UserInfo.module.scss";
import Button from "../../../../components/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faShare,
  faSignsPost,
} from "@fortawesome/free-solid-svg-icons";
import UnderLine from "../../../../components/UnderLine";
import ProfileMenu from "../ProfileMenu";
import Popup from "reactjs-popup";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AuthorItem from "../AuthorItem";

const cx = classNames.bind(style);
function UserInfo({ dataPost, dataLove, profileData }) {
  const { userId } = useParams();
  console.log("userid:" + userId);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupFollowing, setOpenPopupFollowing] = useState(false);
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);
  const [userData, setUserData] = useState({});
  
  useEffect(() => {
    fetch(`http://localhost:8081/api/user/detail/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setUserData(result.result);
        console.log(result);
      });
  }, [userId]);

  const handleOpenFollower = () => {
    setOpenPopup(true);
    fetch(`http://localhost:8081/api/user/follower-account/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setFollower(result.result);
        console.log(result);
      });
  };

  const handleOpenFollowing = () => {
    setOpenPopupFollowing(true);
    fetch(`http://localhost:8081/api/user/following-account/${userId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json", // Set the content type to JSON
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setFollowing(result.result);
        console.log(result);
      });
  };

  const renderUserFollow = (follow) => {
    return follow.map((item, index) => {
      return <AuthorItem authorInfo={item} key={index} />;
    });
  };
  return (
    <div className={cx("wrapper")}>
      <div className={cx("wrapperUserInfo")}>
        <img
          src={userData.userImage}
          alt="avatar"
        ></img>
        <div>
          <div className={cx("action")}>
            <h2 className={cx("userName")}>{userData.userName}</h2>
            <Button primary>Theo dõi</Button>
          </div>
          <ul className={cx("info")}>
            <li>
              <strong>1</strong>
              <Button>Bài viết</Button>
            </li>
            <li>
              <strong>{userData.followerAccounts}</strong>
              <Button to onClick={handleOpenFollower}>
                Follower
              </Button>
            </li>
            <Popup
              open={openPopup} // Kiểm soát mở popup qua trạng thái
              onClose={() => setOpenPopup(false)} // Đóng popup
              modal
              nested
            >
              {(close) => (
                <div className={cx("wrapperPopup")}>
                  <button className = {cx("btnClose")} onClick={close}> &times;</button>
                  <h2>Follower</h2>
                  <div>
                    {follower.length>0 ? (
                      renderUserFollow(follower)
                    ) : (
                      <p>Không có dữ liệu</p>
                    )}
                  </div>
                </div>
              )}
            </Popup>
            <li>
              <Button to onClick={handleOpenFollowing}>
                Theo dõi
              </Button>
              <strong>{userData.followingAccounts}</strong>
            </li>
            <Popup
              open={openPopupFollowing} // Kiểm soát mở popup qua trạng thái
              onClose={() => setOpenPopupFollowing(false)} // Đóng popup
              modal
              nested
            >
              {(close) => (
                <div className={cx("wrapperPopup")}>
                  <button className = {cx("btnClose")} onClick={close}> &times;</button>
                  <h2>Đang Follow</h2>
                  <div>
                    {following.length>0 ? (
                      renderUserFollow(following)
                    ) : (
                      <p>Không có dữ liệu</p>
                    )}
                  </div>
                </div>
              )}
            </Popup>
          </ul>
          <p className={cx("desc")}>Follow me!</p>
        </div>
      </div>
      <div className={cx("wrapperMoreInfo")}>
        <div className={cx("lineAction")}></div>
        <ul className={cx("menu")}>
          <ProfileMenu dataLove={dataLove} />
        </ul>
      </div>
    </div>
  );
}

export default UserInfo;