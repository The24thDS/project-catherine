import React from "react";
import PropTypes from "prop-types";
import { EuiAvatar, EuiHorizontalRule, EuiToolTip } from "@elastic/eui";
import moment from "moment";
import { useHistory } from "react-router-dom";
import { emojify } from "react-emojione";

import PictureURL from "../../../utils/PictureURL";

import styles from "./Post.module.sass";
import ImageGrid from "../../ImageGrid/ImageGrid";

const Post = (props) => {
  const authorName = props.author.firstName + " " + props.author.lastName;
  const authorPFP = new PictureURL(props.author.profilePicture).url;

  const localDate = moment.utc(props.postData.date).local();
  const formatedDate = localDate.calendar();

  const images = props.postData.imageNames.map(
    (imageName) => new PictureURL(imageName).url
  );

  const history = useHistory();

  return (
    <>
      <header className={styles["post-header"]}>
        <EuiAvatar
          name={authorName}
          imageUrl={authorPFP}
          className={styles["author-pfp"]}
          onClick={() => history.push("/user/" + props.author.id)}
          data-private
        />
        <div className={styles["post-info"]}>
          <span data-private>{authorName}</span>
          <EuiToolTip
            position="top"
            content={localDate.format("dddd, MMMM D, YYYY h:mm A")}
          >
            <time dateTime={localDate.format("YYYY-MM-DD HH:mm")}>
              {formatedDate}
            </time>
          </EuiToolTip>
        </div>
      </header>
      <EuiHorizontalRule margin="s" />
      <article className={styles["post-content"]}>
        {props.postData.content !== null
          ? props.postData.content.split("\n").map((el, idx) => (
              <p data-private key={"p" + idx}>
                {emojify(el)}
              </p>
            ))
          : null}
        {images.length ? <ImageGrid data-private images={images} /> : null}
      </article>
    </>
  );
};

Post.propTypes = {
  author: PropTypes.shape({
    id: PropTypes.number.isRequired,
    firstName: PropTypes.string.isRequired,
    lastName: PropTypes.string.isRequired,
    profilePicture: PropTypes.string.isRequired,
  }).isRequired,
  postData: PropTypes.shape({
    content: PropTypes.string,
    date: PropTypes.string.isRequired,
    imageNames: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
};

export default Post;
