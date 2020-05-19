import React from "react";
import PropTypes from "prop-types";

import styles from "./ImageGrid.module.sass";

function ImageGrid(props) {
  const rowNum = () => {
    let value = Math.sqrt(props.images.length);
    const truncValue = Math.trunc(value);
    if (value % truncValue !== 0) {
      value = truncValue + 1;
    }
    return value;
  };

  return (
    <div className={styles.images} style={{ "--rowNum": "" + rowNum() }}>
      {props.images.map((photo, index) => {
        return (
          <img
            key={index}
            className={styles.image}
            src={photo}
            alt="proper alt attribute sent from the server"
          />
        );
      })}
    </div>
  );
}

ImageGrid.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};

export default ImageGrid;
