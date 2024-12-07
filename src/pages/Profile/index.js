import { useEffect, useState } from "react";
import { getToken } from "../../services/localStorageService";
import classNames from "classnames/bind";
import ProfileMenu from "../User/component/ProfileMenu";
import style from "./Profile.module.scss";
import Button from "../../components/Button";
import Popup from "reactjs-popup";
import AuthorItem from "../User/component/AuthorItem";

const cx = classNames.bind(style)
function Profile() {
  const [profileData, setProfileData] = useState({});
  const [follower, setFollower] = useState([]);
  const [following, setFollowing] = useState([]);
  const [openPopup, setOpenPopup] = useState(false);
  const [openPopupFollowing, setOpenPopupFollowing] = useState(false);
  const token = getToken();

  useEffect(() => {
    fetch(`http://localhost:8081/api/user/detail-by-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setProfileData(result.result);
        console.log(token);
        console.log(result.result);
      });
  }, [token]);

  const handleOpenFollower = () => {
    setOpenPopup(true);
   
    fetch(`http://localhost:8081/api/user/follower-account-by-token`, {
      method: "GET",
      headers: {
       "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`, // Set the content type to JSON
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

    fetch(`http://localhost:8081/api/user/following-account-by-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Bearer ${token}`, // Set the content type to JSON
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
      return <AuthorItem authorInfo={item} key={index}/>;
    });
  };

  return (
    <div className={cx("wrapper")}>
      <div className={cx("wrapperUserInfo")}>
        <img
          src={profileData.userImage}
          alt="avatar"
        ></img>
        <div>
          <div className={cx("action")}>
            <h2 className={cx("userName")}>{profileData.userName}</h2>
            {/* <Button primary>Theo dõi</Button> */}
          </div>
          <ul className={cx("info")}>
            <li>
              <strong>1</strong>
              <Button>Bài viết</Button>
            </li>
            <li>
              <strong>{profileData.followerAccounts}</strong>
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
                  <button className={cx("btnClose")} onClick={close}>
                    {" "}
                    &times;
                  </button>
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
              <strong>{profileData.followingAccounts}</strong>
            </li>
            <Popup
              open={openPopupFollowing} // Kiểm soát mở popup qua trạng thái
              onClose={() => setOpenPopupFollowing(false)} // Đóng popup
              modal
              nested
            >
              {(close) => (
                <div className={cx("wrapperPopup")}>
                  <button className={cx("btnClose")} onClick={close}>
                    {" "}
                    &times;
                  </button>
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
          {/* <ProfileMenu dataLove={dataLove} /> */}
        </ul>
      </div>
    </div>
  );
}

export default Profile;
