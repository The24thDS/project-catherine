import React from "react";
import {
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiButton,
  EuiCheckbox,
} from "@elastic/eui";
import * as yup from "yup";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import LogRocket from "logrocket";

import Modal from "../../Modal";
import ForgotPasswordForm from "../ForgotPasswordForm";

import "../forms.sass";
import ServerRequest from "../../../utils/ServerRequest";
import { setLoggedIn, setUserInfo } from "../../../redux/user/user.actions";
import { setFriendsInfo } from "../../../redux/friends/friends.actions";
import { getUserDetails, getUserFriends } from "../../../utils/user";

class LoginForm extends React.Component {
  static propTypes = {
    history: PropTypes.object.isRequired,
    setLoggedIn: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      formInputs: {
        email: "",
        password: "",
      },
      formValidation: {
        email: true,
        password: true,
      },
      loading: false,
      formErrors: [],
      rememberMe: false,
      forgotPasswordModal: false,
    };
  }

  onInputChange = ({ target }) => {
    this.setState((prevState) => ({
      formInputs: {
        ...prevState.formInputs,
        [target.name]: target.value,
      },
      formValidation: {
        email: true,
        password: true,
      },
      formErrors: [],
    }));
  };

  toggleForgotPasswordModal = () => {
    this.setState((prevState) => ({
      ...prevState,
      forgotPasswordModal: !prevState.forgotPasswordModal,
    }));
  };

  validateForm = async () => {
    const loginFormSchema = yup.object({
      email: yup.string().trim().email().required(),
      password: yup.string().trim().required(),
    });
    try {
      const castedData = await loginFormSchema.validate(this.state.formInputs, {
        abortEarly: false,
      });
      this.setState({
        formInputs: {
          ...castedData,
        },
      });
      return true;
    } catch (error) {
      console.log(error);
      const formValidation = {};
      error.inner.forEach((errObj) => {
        formValidation[errObj.path] = false;
      });
      if (error.name === "ValidationError") {
        this.setState((prevState) => ({
          formErrors: error.errors.map(
            (error) => error.charAt(0).toUpperCase() + error.slice(1)
          ),
          formValidation: {
            ...prevState.formValidation,
            ...formValidation,
          },
        }));
      }
      return false;
    }
  };

  login = async () => {
    this.setState({ loading: true });
    const req = new ServerRequest(
      "/auth/login",
      "POST",
      undefined,
      this.state.formInputs
    ).useJsonBody();
    const response = await req.send();
    const data = await response.json();

    if (data.success === true) {
      const token = data.message;
      if (this.state.rememberMe) {
        window.localStorage.setItem("token", token);
      } else {
        window.sessionStorage.setItem("token", token);
      }
      const userDetails = await getUserDetails();
      if (userDetails !== false) {
        LogRocket.identify("" + userDetails.id);
        const userFriends = (await getUserFriends()).reduce(
          (acc, value) => ({ [value.id]: { ...value }, ...acc }),
          {}
        );
        this.props.setUserInfo(userDetails);
        this.props.setLoggedIn(true);
        this.props.setFriendsInfo(userFriends);
        this.props.history.push("/feed");
      }
    } else {
      this.setState({
        loading: false,
        formErrors: data.reason || data.message,
      });
    }
  };

  submitForm = async (ev) => {
    ev.preventDefault();
    const valid = await this.validateForm();
    if (valid) {
      await this.login();
    } else {
      return false;
    }
  };

  render() {
    const {
      formInputs: { email, password },
      formValidation,
      loading,
      formErrors,
      rememberMe,
      forgotPasswordModal,
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
          <EuiFormRow label="Email" isInvalid={!formValidation.email} fullWidth>
            <EuiFieldText
              name="email"
              type="email"
              value={email}
              onChange={this.onInputChange}
              fullWidth
            />
          </EuiFormRow>
          <EuiFormRow
            label="Password"
            isInvalid={!formValidation.password}
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
          <EuiFormRow>
            <EuiCheckbox
              id="rememberMe"
              name="rememberMe"
              onChange={(ev) =>
                this.setState((prevState) => ({
                  rememberMe: !prevState.rememberMe,
                }))
              }
              checked={rememberMe}
              label="Remember me"
            />
          </EuiFormRow>
          <EuiFormRow className="form-button" fullWidth>
            <EuiButton fill isLoading={loading} type="submit" fullWidth>
              Login
            </EuiButton>
          </EuiFormRow>
          <EuiFormRow className="form-button" fullWidth>
            <EuiButton
              onClick={this.toggleForgotPasswordModal}
              type="button"
              fullWidth
            >
              Forgot password?
            </EuiButton>
          </EuiFormRow>
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

// this function will map boundActionCreators to props
const mapDispatchToProps = (dispatch) => ({
  setLoggedIn: (loggedIn) => dispatch(setLoggedIn(loggedIn)),
  setUserInfo: (userDetails) => dispatch(setUserInfo(userDetails)),
  setFriendsInfo: (friendsArray) => dispatch(setFriendsInfo(friendsArray)),
});

export default connect(null, mapDispatchToProps)(LoginForm);
