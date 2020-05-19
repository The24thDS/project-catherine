import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Redirect } from "react-router-dom";

import ServerRequest from "../../utils/ServerRequest";

import "./activation.sass";
import Spinner from "../../components/Spinner/Spinner";

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
      <h1>{}</h1>
      <Spinner
        text={
          activated === false
            ? "Activating your account"
            : activated === true
            ? "Account activated! You'll be redirected to Login."
            : "Account activation failed!"
        }
        infinite={activated === false}
        textSize="36px"
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
