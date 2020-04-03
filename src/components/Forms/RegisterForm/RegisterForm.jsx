import React from "react";
import { withRouter } from "react-router-dom";
import {
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiButton,
  EuiText,
  EuiToolTip,
  EuiProgress,
  EuiFlexGroup,
  EuiFlexItem,
  EuiDatePicker
} from "@elastic/eui";

import {
  isEmailAvailable,
  isUsernameAvailable,
  validatePassword,
  calculatePasswordStrength
} from "../utils";
import rightArrow from "../../../assets/arrow-right.svg";
import "../forms.sass";
import moment from "moment";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      firstName: "",
      lastName: "",
      usernameInvalid: false,
      email: "",
      emailInvalid: false,
      birthDate: moment().subtract(18, "years"),
      password: "",
      passwordStrength: 0,
      passwordInvalid: false,
      passwordError: "",
      passwordLoading: false,
      loading: false,
      formErrors: [],
      formMessage: "",
      submitDisabled: false
    };
    this.validatePassword = validatePassword(this);
    this.serverUrl = process.env.REACT_APP_SERVER_URL;
  }

  onInputChange = event => {
    this.setState({ [event.target.name]: event.target.value, formErrors: "" });
  };

  validateUsername = async () => {
    const valid = await isUsernameAvailable(this.state.username);
    if (!valid) {
      this.setState({
        usernameInvalid: true
      });
    } else {
      this.setState({
        usernameInvalid: false
      });
    }
  };

  validateEmail = async () => {
    const valid = await isEmailAvailable(this.state.email);
    if (!valid) {
      this.setState({
        emailInvalid: true
      });
    } else {
      this.setState({
        emailInvalid: false
      });
    }
  };

  setPasswordStrength = password => {
    this.setState({
      passwordStrength: calculatePasswordStrength(password)
    });
  };

  initiateCountdown = () => {
    let seconds = 2;
    const update = setInterval(() => {
      this.setState({
        formMessage: `Account created! Redirecting to Activation page in ${seconds}s`
      });
      seconds--;
      if (seconds === 0) {
        clearInterval(update);
      }
    }, 1000);
  };

  register = async () => {
    this.setState({
      loading: true
    });
    const response = await fetch(`${this.serverUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: this.state.username,
        email: this.state.email,
        password: this.state.password
      })
    });

    if (response.status === 201) {
      this.setState({
        loading: false,
        formMessage: "Account created! Redirecting to Activation page in 3s"
      });
      this.initiateCountdown();
      setTimeout(() => {
        this.props.history.push("/activate-account");
      }, 3000);
    } else if (response.status === 400) {
      this.setState({
        loading: false,
        formErrors: "An account with this email or username already exists",
        emailInvalid: true,
        usernameInvalid: true
      });
    }
  };

  submitForm = async event => {
    event.preventDefault();
    await this.validateUsername();
    await this.validateEmail();
    await this.validatePassword();
    const {
      usernameInvalid,
      emailInvalid,
      passwordInvalid,
      submitDisabled
    } = this.state;
    if (
      !usernameInvalid &&
      !emailInvalid &&
      !passwordInvalid &&
      !submitDisabled
    ) {
      await this.register();
    } else {
      this.setState({
        formErrors: "At least one of the inputs is invalid"
      });
    }
  };

  render() {
    const {
      firstName,
      lastName,
      email,
      emailInvalid,
      birthDate,
      password,
      passwordStrength,
      passwordError,
      passwordInvalid,
      passwordLoading,
      loading,
      formErrors,
      formMessage,
      submitDisabled
    } = this.state;

    const passwordHelpText = (
      <div>
        <EuiFlexGroup
          gutterSize="none"
          alignItems="center"
          justifyContent="spaceBetween"
          responsive={false}
          style={{ height: "20px" }}
        >
          <EuiFlexItem style={{ height: "100%" }} grow={1}>
            Strength:
          </EuiFlexItem>
          <EuiFlexItem grow={3}>
            <EuiProgress
              value={passwordStrength}
              max={100}
              aria-label="password strength"
              color={
                passwordStrength < 50
                  ? "danger"
                  : passwordStrength < 75
                  ? "accent"
                  : "secondary"
              }
            />
          </EuiFlexItem>
        </EuiFlexGroup>
      </div>
    );

    const passwordTooltipContent = (
      <EuiText size="xs">
        <ul>
          <li>Must be at least 10 characters</li>
          <li>Must not be your email address</li>
          <li>Must not be a password exposed in a data breach</li>
        </ul>
      </EuiText>
    );

    return (
      <EuiForm
        className="landing-form"
        isInvalid={formErrors.length > 0}
        error={formErrors}
        component="form"
        onSubmit={this.submitForm}
      >
        <EuiFlexGroup className="name-inputs" gutterSize="none">
          <EuiFlexItem>
            <EuiFormRow label="First Name">
              <EuiFieldText
                name="firstName"
                value={firstName}
                onChange={this.onInputChange}
                fullWidth
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow label="Last Name">
              <EuiFieldText
                name="lastName"
                value={lastName}
                onChange={this.onInputChange}
                fullWidth
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
        <EuiFormRow
          label="Email"
          isInvalid={emailInvalid}
          error="Email is invalid or taken"
          onBlur={this.validateEmail}
          fullWidth
        >
          <EuiFieldText
            name="email"
            type="email"
            value={email}
            onChange={this.onInputChange}
            fullWidth
          />
        </EuiFormRow>
        <EuiFormRow fullWidth label="Date of Birth">
          <EuiDatePicker
            name="birthDate"
            dateFormat="YYYY-MM-DD"
            selected={birthDate}
            onChange={ev =>
              this.onInputChange({
                target: { name: "birthDate", value: ev }
              })
            }
            fullWidth
          />
        </EuiFormRow>
        <EuiFormRow
          label="Password"
          helpText={passwordHelpText}
          isInvalid={passwordInvalid}
          error={passwordError}
          onBlur={this.validatePassword}
          fullWidth
        >
          <EuiToolTip
            position="top"
            title="Stay safe — don't reuse passwords."
            content={passwordTooltipContent}
            anchorClassName="full-width"
          >
            <EuiFieldText
              name="password"
              type="password"
              value={password}
              minLength="10"
              onChange={ev => {
                this.onInputChange(ev);
                this.setPasswordStrength(ev.target.value);
              }}
              isLoading={passwordLoading}
              fullWidth
            />
          </EuiToolTip>
        </EuiFormRow>
        <EuiFormRow className="form-button" fullWidth>
          <EuiButton
            fill
            isLoading={loading}
            isDisabled={submitDisabled}
            type="submit"
            fullWidth
          >
            <img src={rightArrow} alt="next" />
          </EuiButton>
        </EuiFormRow>
        <EuiText className="form-message">{formMessage}</EuiText>
      </EuiForm>
    );
  }
}

export default withRouter(RegisterForm);
