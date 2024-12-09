import AvatarWrapper from "../AvatarWrapper";
import classNames from "classnames/bind";
import style from "./AuthorItem.module.scss"
import { Link } from "react-router-dom";

const cx = classNames.bind(style)
function AuthorItem({authorInfo}) {
    return <Link to={"/author"} className = {cx("wrapper")}>
        <AvatarWrapper><img src={authorInfo.userImage} alt="author-avatar"/></AvatarWrapper>
        <div className = {cx("info")}>
            <h5 className = {cx("name")}>{authorInfo.userName}</h5>
            <ul>
                <li className = {cx("totalBook")}><p>{authorInfo.userId} Posts</p></li>
            </ul>
        </div>
    </Link>;
}

export default AuthorItem;