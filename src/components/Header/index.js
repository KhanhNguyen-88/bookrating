import { faStar } from "@fortawesome/free-regular-svg-icons";
import {
  faE,
  faEarthAmerica,
  faEllipsisV,
  faMessage,
  faMoon,
  faPaperPlane,
  faPlus,
  faQuestion,
  faSearch,
  faSpinner,
  faSun,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Tippy from "@tippyjs/react/headless";
import classNames from "classnames/bind";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { logOut } from "../../services/authenticationService";
import AvatarWrapper from "../AvatarWrapper";
import Button from "../Button";
import HeaderMenu from "../HeaderMenu";
import MenuItem from "../MenuItem";
import WrapperMenu from "../WrapperMenu";
import style from "./Header.module.scss";
import ItemBookSearch from "../ItemBookSearch";
import CreatePost from "../../pages/CreatePost";
import Popup from "reactjs-popup";


const MENU_ITEMS = [
  {
    name: "Ngôn ngữ",
    leftIcon: <FontAwesomeIcon icon={faEarthAmerica} />,
    children: {
      title: "Ngôn ngữ",
      data: [
        { name: "Tiếng Anh", leftIcon: <FontAwesomeIcon icon={faE} /> },
        { name: "Tiếng Việt", leftIcon: <FontAwesomeIcon icon={faStar} /> },
      ],
    },
  },
  {
    name: "Chế độ nền",
    leftIcon: <FontAwesomeIcon icon={faSun} />,
    children: {
      title: "Nền",
      data: [
        { name: "Tối", leftIcon: <FontAwesomeIcon icon={faMoon} /> },
        { name: "Sáng", leftIcon: <FontAwesomeIcon icon={faSun} /> },
      ],
    },
  },
  {
    name: "Hỏi đáp",
    leftIcon: <FontAwesomeIcon icon={faQuestion} />,
  },
];

const cx = classNames.bind(style);
function Header({ userData, reRender }) {
  const [history, setHistory] = useState([{ data: MENU_ITEMS }]);
  const lastItem = history[history.length - 1];
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState();
  const [data, setData] = useState();
  const [openPopup, setOpenPopup] = useState(false);
  const navigate = useNavigate();

  const renderMenuItems = () => {
    return lastItem.data.map((item, index) => {
      const isParent = !!item.children;
      return (
        <MenuItem
          onClick={() => {
            if (isParent) {
              setHistory((prev) => [...prev, item.children]);
            }
          }}
          key={index}
          nameItem={item.name}
          leftIcon={item.leftIcon}
        ></MenuItem>
      );
    });
  };
  //
  const onBack = () => {
    setHistory((prev) => prev.slice(0, prev.length - 1));
  };
  const renderHeaderMenu = () => {
    return <HeaderMenu title={lastItem.title} onClick={onBack} />;
  };
  const handleLogout = () => {
    navigate("/")
    logOut(); // remove token
    reRender(); // re-render layout
  };

  const handleSuggestionClick = (author, e) => {
    e.preventDefault();
    setSearchTerm(author);
    setSuggestions([]); // Xóa gợi ý sau khi chọn
  };

  const handleChangeInput = (e) => {
    setSearchTerm(e.target.value);
    if (!e.target.value.trim()) {
      setSearchTerm(null);
      setSuggestions([]);
    } else {
      setSuggestions(data);
    }
  };

  useEffect(() => {
    fetch(`http://localhost:8081/api/book/search-common/${searchTerm}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setData(result.result);
      });
  }, [searchTerm]);
  const handleClearSearch = () => {
    console.log("click");
    setSearchTerm(null);
  };


  const handleClosePopup = (close) => {
    const confirmClose = window.confirm("Bạn có chắc chắn muốn hủy bài viết đang tạo?");
    if (confirmClose) {
      close(); // Thực sự đóng popup nếu người dùng xác nhận
    }
  };

  //
  return (
    <div className={cx("wrapper")}>
      <div className={cx("logo")}>
        <Link to={"/"}>
          <img
            src="https://s.gr-assets.com/assets/layout/header/goodreads_logo.svg"
            alt="logo"
          ></img>
        </Link>
      </div>
      <div className={cx("search")}>
        <Tippy
          placement="bottom"
          visible={suggestions.length > 0}
          interactive
          render={() => {
            return suggestions.length > 0 ? (
              <ul className={cx("wrapperSug")}>
                <p>Gợi ý sách</p>
                {suggestions.map((item, index) => (
                  <ItemBookSearch key={index} item={item} />
                ))}
              </ul>
            ) : null; // Không render gì nếu không có gợi ý
          }}
        >
          <input
            placeholder="Tìm kiếm sách!..."
            value={searchTerm}
            onChange={(e) => handleChangeInput(e)}
          ></input>
        </Tippy>
        <span className={cx("searchIcon")}>
          <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
        </span>
        <span className={cx("line")}></span>
        {/* <span className={cx("loadIcon")}>
          <FontAwesomeIcon icon={faSpinner} />
        </span> */}
        <span className={cx("clearIcon")} onClick={handleClearSearch}>
          <FontAwesomeIcon icon={faXmarkCircle} />
        </span>
      </div>
      <div className={cx("action")}>
        {userData ? (
          <div className={cx("actionLogin")}>
            <div><Button onClick={()=>setOpenPopup(true)} leftIcon={<FontAwesomeIcon icon={faPlus}/>}>Tải lên</Button></div>
            <Popup
                open={openPopup} // Kiểm soát mở popup qua trạng thái
                onClose={() => setOpenPopup(false)} // Đóng popup
                closeOnDocumentClick={false}
                modal
                nested
              >
                {(close) => (
                  <div className = {cx("createPost")}>
                     <Button className="close" onClick={()=>handleClosePopup(close)}>
                        &times;
                      </Button>
                    <CreatePost handleClose={close}/>
                  </div>
                )}
              </Popup>
            {/* <Button to leftIcon={<FontAwesomeIcon icon={faMessage} />}></Button>
            <Button
              to
              leftIcon={<FontAwesomeIcon icon={faPaperPlane} />}
            ></Button> */}
            <AvatarWrapper>
              <Tippy
                delay={[0, 500]}
                interactive
                render={() => {
                  return (
                    <div>
                      <ul>
                        <Button primary onClick={handleLogout}>Logout</Button>
                      </ul>
                    </div>
                  );
                }}
              >
                <img src={userData.userImage} alt="avatar" />
              </Tippy>
            </AvatarWrapper>
          </div>
        ) : (
          <div className={cx("actionNotLogin")}>
            <li>
              <Button btnHeader to={"/login"}>
                Đăng nhập
              </Button>
            </li>
            <li>
              <Button btnHeader to={"/register"}>
                Đăng ký
              </Button>
            </li>
            <Tippy
              delay={[0, 500]}
              // visible
              interactive
              render={() => {
                return (
                  <WrapperMenu>
                    {history.length > 1 && renderHeaderMenu()}
                    {renderMenuItems()}
                  </WrapperMenu>
                );
              }}
            >
              <span className={cx("moreMenu")}>
                <FontAwesomeIcon icon={faEllipsisV} />
              </span>
            </Tippy>
          </div>
        )}
      </div>
    </div>
  );
}

export default Header;
