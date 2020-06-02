import React, { useState } from "react";
import PropTypes from "prop-types";
import { EuiFlexGroup, EuiFlexItem, EuiTitle, EuiIcon } from "@elastic/eui";

import "./landingPage.sass";
import blackLogo from "../../assets/logo-black.svg";
import LoginForm from "../../components/Forms/LoginForm/";
import RegisterForm from "../../components/Forms/RegisterForm/";

function LandingPage(props) {
  document.title = "Project Catherine | Landing";
  let initialForm = "login";
  const [form, setForm] = useState(initialForm);
  return (
    <EuiFlexGroup
      className="landing"
      gutterSize="none"
      responsive={true}
      wrap={true}
    >
      <EuiFlexItem className="landing--information" component="section">
        <EuiTitle textTransform="uppercase">
          <h1>Project Catherine</h1>
        </EuiTitle>
        <EuiIcon className="logo" size="original" type={blackLogo} />
        <article>
          <h2>Welcome to Project Catherine!</h2>
          <p>
            Project Catherine is a social network powered by React, Redux, Java
            and Neo4J. These are a few of the features that are currently
            implemented:
          </p>
          <ul style={{ listStyle: "circle" }}>
            <li>Create, like and comment on posts</li>
            <li>Find and add your friends</li>
            <li>Chat with your friends in realtime</li>
          </ul>
          <p>
            We value privacy so we don't save any chat messages in the database.
            But to provide a better experience we store them on your computer
            during a session. Once you log out they are gone.
          </p>
        </article>
      </EuiFlexItem>
      <EuiFlexItem className="landing--forms" component="section">
        <nav className="forms-nav">
          <button
            className={`forms-nav-button ${
              form === "register" ? " forms-nav-button--active" : ""
            }`}
            onClick={() => {
              if (form !== "register") {
                setForm("register");
              }
            }}
          >
            SIGNUP
          </button>
          <button
            className={`forms-nav-button ${
              form === "login" ? " forms-nav-button--active" : ""
            }`}
            onClick={() => {
              if (form !== "login") {
                setForm("login");
              }
            }}
          >
            LOGIN
          </button>
        </nav>
        {form === "login" ? (
          <LoginForm history={props.history} />
        ) : (
          <RegisterForm />
        )}
      </EuiFlexItem>
    </EuiFlexGroup>
  );
}

LandingPage.propTypes = {
  history: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};

export default LandingPage;
