import React from "react";
import { withRouter } from "react-router-dom";
import {
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiTitle,
  EuiPage,
  EuiButton,
  EuiLink,
  EuiText,
  EuiCheckbox,
  EuiFlexGroup
} from "@elastic/eui";

import Modal from "../../Modal";
import ForgotPasswordForm from "../ForgotPasswordForm";

import "../forms.sass";

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      user: "",
      userInvalid: false,
      password: "",
      passwordInvalid: false,
      loading: false,
      formErrors: [],
      formMessage: "",
      rememberMe: false,
      forgotPasswordModal: false
    };
    this.serverUrl = process.env.REACT_APP_SERVER_URL;
  }

  onInputChange = event => {
    this.setState({ [event.target.name]: event.target.value, formErrors: "" });
  };

  validateUser = () => {
    if (this.state.user.length === 0) {
      this.setState({
        userInvalid: true
      });
    } else {
      this.setState({
        userInvalid: false
      });
    }
  };

  validatePassword = () => {
    if (this.state.password.length === 0) {
      this.setState({
        passwordInvalid: true
      });
    } else {
      this.setState({
        passwordInvalid: false
      });
    }
  };

  toggleForgotPasswordModal = () => {
    this.setState(prevState => ({
      ...prevState,
      forgotPasswordModal: !prevState.forgotPasswordModal
    }));
  };

  login = async () => {
    this.setState({ loading: true });
    const response = await fetch(`${this.serverUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user: this.state.user,
        password: this.state.password
      })
    });

    const data = await response.json();

    if (data.success === true) {
      if (this.state.rememberMe) {
        window.localStorage.setItem("token", data.message);
      } else {
        window.sessionStorage.setItem("token", data.message);
      }
      this.props.setLoggedIn(true, data.message);
      this.props.history.push("/events");
    } else {
      this.setState({
        loading: false,
        formErrors: data.reason || data.message
      });
    }
  };

  submitForm = async ev => {
    ev.preventDefault();
    const { userInvalid, passwordInvalid, user, password } = this.state;
    if (!userInvalid && !passwordInvalid && user.length && password.length) {
      await this.login();
    } else {
      this.setState({
        formErrors: "At least one of the inputs is invalid"
      });
    }
  };

  render() {
    const {
      user,
      userInvalid,
      password,
      passwordInvalid,
      loading,
      formErrors,
      formMessage,
      rememberMe,
      forgotPasswordModal
    } = this.state;

    return (
      <>
        <EuiForm
          className="landing-form"
          isInvalid={formErrors.length > 0}
          error={formErrors}
          onSubmit={this.submitForm}
          component="form"
        >
          <EuiFormRow
            label="Email"
            isInvalid={userInvalid}
            error="Can't be empty"
            onBlur={this.validateUser}
            fullWidth
          >
            <EuiFieldText
              name="user"
              type="text"
              value={user}
              onChange={this.onInputChange}
              fullWidth
            />
          </EuiFormRow>
          <EuiFormRow
            label="Password"
            isInvalid={passwordInvalid}
            error="Can't be empty"
            onBlur={this.validatePassword}
            fullWidth
          >
            <EuiFieldText
              name="password"
              type="password"
              value={password}
              onChange={this.onInputChange}
              fullWidth
            />
          </EuiFormRow>
          <EuiFlexGroup
            gutterSize="none"
            justifyContent="spaceBetween"
            style={{ fontSize: "14px", margin: "6px 0" }}
          >
            <EuiCheckbox
              id="rememberMe"
              name="rememberMe"
              onChange={ev =>
                this.onInputChange({
                  target: { name: ev.target.name, value: !rememberMe }
                })
              }
              checked={rememberMe}
              label="Remember me"
            />
            <EuiLink
              style={{ marginLeft: "10px" }}
              onClick={this.toggleForgotPasswordModal}
            >
              Forgot password?
            </EuiLink>
          </EuiFlexGroup>
          <EuiFormRow className="form-button">
            <EuiButton fill isLoading={loading} type="submit">
              Log in
            </EuiButton>
          </EuiFormRow>
          <EuiText className="form-message">{formMessage}</EuiText>
        </EuiForm>
        {forgotPasswordModal && (
          <Modal>
            <ForgotPasswordForm closeModal={this.toggleForgotPasswordModal} />
          </Modal>
        )}
      </>
    );
  }
}

export default withRouter(LoginForm);
