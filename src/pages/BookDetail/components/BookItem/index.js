import { faChevronDown } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import classNames from "classnames/bind";
import AuthorItem from "../../../../components/AuthorItem";
import Button from "../../../../components/Button";
import ShowStars from "../../../../components/ShowStars";
import UnderLine from "../../../../components/UnderLine";
import style from "./BookItem.module.scss";
import { useEffect, useState } from "react";

const cx = classNames.bind(style);
function BookItem({ item, feedBackList }) {
  const [categories, setCategories] = useState([]);
  const allRating = feedBackList.map((itemFB, index) => {
    return itemFB.rating;
  });
  const sum = allRating.reduce((acc, cur) => {
    return acc + cur;
  }, 0);
  const avg = Math.round((sum / allRating.length) * 10) / 10;
  console.log(avg);
  const ratings = feedBackList.length;
 
  useEffect(() => {
    const paramsBookId = {
      bookId: item.id || 0,
    };
    const queryBookIdString = new URLSearchParams(paramsBookId).toString();
    fetch(
      `http://localhost:8081/api/category/get-by-book?${queryBookIdString}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    ).then((response) => {
      return response.json()
    })
    .then((result)=>{
      setCategories(result.result);
      console.log(result.result)
    })
  }, [item.id]);
  const renderBookGenres = () => {
    return categories.map((item, index) => {
      return (
        <Button key={index} to={`/explore/${item.id}`}>
          {item.cateName}
        </Button>
      );
    });
  };

  return (
    <div className={cx("book")}>
      <div className={cx("thumbnail")}>
        <img src={item.bookImage} alt="book-img" />
        <div className={cx("btnGroup")}>
          <div className={cx("wtRead")}>
            <Button second>Quan tâm</Button>
            <span></span>
            <Button second>
              <FontAwesomeIcon icon={faChevronDown} />
            </Button>
          </div>
          <Button second>Tìm mua</Button>
        </div>
      </div>
      <div className={cx("info")}>
        <h3 className={cx("title")}>{item.bookName}</h3>
        <div>
          <div className={cx("rate")}>
            <div className={cx("points")}>
              <ShowStars points={avg} />
              <p>{avg === NaN ? 0 : avg}</p>
            </div>
            <span className={cx("ratings")}>{ratings} ratings</span>
          </div>
        </div>
        <div className={cx("award")}>
          <span>Giải thưởng</span>
          <span className={cx("awardName")}>
            <Button to>Winner for Best Romance (2023)</Button>
          </span>
        </div>
        <div className={cx("intro")}>
          <p>{item.bookDescription}</p>
        </div>
        <UnderLine/>
        <div className={cx("genres")}>
          <p>Thể loại</p>
          {renderBookGenres()}
        </div>
        <div className={cx("author")}>
          <p>Author</p>
          {/* <AuthorItem authorInfo={} /> */}
          <li>{item.bookAuthor}</li>
        </div>
        <UnderLine />
        <div className={cx("editionInfo")}>
          <ul>
            <li>
              <p>Format</p>
              <p className={cx("detail")}>{item.bookFormat}</p>
            </li>
            <li>
              <p>Published</p>
              <p className={cx("detail")}>{item.publishedDate}</p>
            </li>
            <li>
              <p>Language</p>
              <p className={cx("detail")}>{}</p>
            </li>
          </ul>
        </div>
        <UnderLine></UnderLine>
        <div></div>
      </div>
    </div>
  );
}

export default BookItem;
