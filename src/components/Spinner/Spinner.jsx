import React from "react";

import BlackLogo from "../../assets/logo-black.svg";

import styles from "./Spinner.module.sass";

export default function Spinner(props) {
  return (
    <div className={styles["sheep-loader"]} style={props.style}>
      <p style={{ fontSize: props.textSize }}>{props.text}</p>
      <img
        src={BlackLogo}
        className={styles.heartBeat}
        style={{
          animationIterationCount: props.infinite ? "infinite" : "1",
          width: props.imageSize,
        }}
        alt="Sheep Loader"
      />
    </div>
  );
}

Spinner.defaultProps = {
  style: {},
  textSize: "18px",
  imageSize: "120px",
};
