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
          <p>
            But I must explain to you how all this mistaken idea of denouncing
            pleasure and praising pain was born and I will give you a complete
            account of the system, and expound the actual teachings of the great
            explorer of the truth, the master-builder of human happiness. No one
            rejects, dislikes, or avoids pleasure itself, because it is
            pleasure, but because those who do not know how to pursue pleasure
            rationally encounter consequences that are extremely painful. Nor
            again is there anyone who loves or pursues or desires to obtain pain
            of itself, because it is pain, but because occasionally
            circumstances occur in which toil and pain can procure him some
            great pleasure. To take a trivial example, which of us ever
            undertakes laborious physical exercise, except to obtain some
            advantage from it? But who has any right to find fault with a man
            who chooses to enjoy a pleasure that has no annoying consequences,
            or one who avoids a pain that
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
