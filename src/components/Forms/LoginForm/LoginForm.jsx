import React from "react";
import {
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiButton,
  EuiCheckbox,
} from "@elastic/eui";
import * as yup from "yup";

import Modal from "../../Modal";
import ForgotPasswordForm from "../ForgotPasswordForm";

import "../forms.sass";

class LoginForm extends React.Component {
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
      forgotPasswordModal: true,
    };
    this.serverUrl = process.env.REACT_APP_SERVER_URL;
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
    const response = await fetch(`${this.serverUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        user: this.state.user,
        password: this.state.password,
      }),
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
        formErrors: data.reason || data.message,
      });
    }
  };

  submitForm = async (ev) => {
    ev.preventDefault();
    const valid = await this.validateForm();
    if (valid) {
      // await this.login();
    } else {
      this.setState({
        formErrors: "At least one of the inputs is invalid",
      });
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

export default LoginForm;
