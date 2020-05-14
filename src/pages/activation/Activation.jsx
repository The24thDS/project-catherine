import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

import ServerRequest from "../../utils/ServerRequest";

import "./activation.sass";
import BlackLogo from "../../assets/logo-black.svg";

function Activation(props) {
  document.title = "Project Catherine | Activation";
  const [activated, setActivated] = useState(false);
  const token = props.match.params.token;

  useEffect(() => {
    const activateAccount = async () => {
      const req = new ServerRequest(
        "/auth/enableAccount",
        "POST",
        {
          "Content-Type": "application/json",
        },
        { token }
      );
      const response = await req.send();
      const body = await response.json();
      if (!body.message.includes("Error")) {
        setActivated(true);
        setTimeout(() => {
          setActivated("redirect");
        }, 3000);
      } else {
        setActivated("failed");
      }
    };
    activateAccount();
  }, [token]);

  return (
    <div className="activation-page">
      <h1>
        {activated === false
          ? "Activating your account"
          : activated === true
          ? "Account activated! You'll be redirected to Login."
          : "Account activation failed!"}
      </h1>
      <img
        src={BlackLogo}
        className="heartBeat"
        style={
          activated !== "failed" ? { animationIterationCount: "infinite" } : {}
        }
        alt="Sheep Loader"
      />
      {activated === "redirect" ? (
        <Redirect
          to={{
            pathname: "/",
          }}
        />
      ) : (
        ""
      )}
    </div>
  );
}

Activation.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default Activation;
