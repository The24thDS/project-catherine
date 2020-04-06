import React from "react";
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
  EuiDatePicker,
} from "@elastic/eui";
import moment from "moment";
import * as yup from "yup";

import { validatePassword, calculatePasswordStrength } from "../utils";
import rightArrow from "../../../assets/arrow-right.svg";
import "../forms.sass";

class RegisterForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formInputs: {
        firstName: "",
        lastName: "",
        email: "",
        birthDate: moment().subtract(14, "years"),
        password: "",
      },
      formValidation: {
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        password: true,
      },
      passwordStrength: {
        value: 0,
        checking: false,
      },
      loading: false,
      formErrors: [],
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
        firstName: true,
        lastName: true,
        email: true,
        birthDate: true,
        password: true,
      },
      formErrors: "",
    }));
  };

  validateForm = async () => {
    const registerFormSchema = yup.object({
      firstName: yup.string().trim().required("First Name is a required field"),
      lastName: yup.string().trim().required("Last Name is a required field"),
      email: yup.string().trim().email().required(), // TODO: Check if the email is not registered already
      birthDate: yup
        .date()
        .max(
          moment().subtract(14, "years"),
          "You must be at least 14 years old."
        )
        .required("Date of Birth is a required field"),
      password: yup
        .string()
        .trim()
        .min(10)
        .notOneOf(
          this.state.formInputs.email !== ""
            ? [this.state.formInputs.email]
            : []
        )
        .test(
          "is-not-pwned",
          "Your password was exposed in a data breach. Stop using it! (source: haveibeenpwned.com)",
          async (value) => {
            this.setState((prevState) => ({
              passwordStrength: {
                ...prevState.passwordStrength,
                checking: true,
              },
            }));
            const result = await validatePassword(value);
            this.setState((prevState) => ({
              passwordStrength: {
                ...prevState.passwordStrength,
                checking: false,
              },
            }));
            return result;
          }
        )
        .required(),
    });
    try {
      const castedData = await registerFormSchema.validate(
        this.state.formInputs,
        {
          abortEarly: false,
        }
      );
      this.setState((prevState) => ({
        formInputs: {
          ...castedData,
          birthDate: prevState.formInputs.birthDate,
        },
      }));
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
    }
  };

  setPasswordStrength = (password) => {
    this.setState((prevState) => ({
      passwordStrength: {
        ...prevState.passwordStrength,
        value: calculatePasswordStrength(password),
      },
    }));
  };

  register = async () => {
    this.setState({
      loading: true,
    });
    const response = await fetch(`${this.serverUrl}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...this.state.formInputs,
      }),
    });

    if (response.status === 201) {
      this.setState({
        loading: false,
        formMessage: "Account created! Redirecting to Activation page in 3s",
      });
    } else if (response.status === 400) {
      this.setState((prevState) => ({
        loading: false,
        formErrors: "An account with this email already exists",
        formValidation: {
          ...prevState.formValidation,
          email: false,
        },
      }));
    }
  };

  submitForm = async (event) => {
    event.preventDefault();
    const valid = await this.validateForm();
    if (valid) {
      // submit form
      // await register()
    } else {
      return false;
    }
  };

  render() {
    const {
      formInputs: { firstName, lastName, email, birthDate, password },
      formValidation,
      passwordStrength,
      loading,
      formErrors,
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
              value={passwordStrength.value}
              max={100}
              aria-label="password strength"
              color={
                passwordStrength.value < 50
                  ? "danger"
                  : passwordStrength.value < 75
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
            <EuiFormRow
              isInvalid={!formValidation.firstName}
              label="First Name"
              fullWidth
            >
              <EuiFieldText
                name="firstName"
                value={firstName}
                onChange={this.onInputChange}
                fullWidth
              />
            </EuiFormRow>
          </EuiFlexItem>
          <EuiFlexItem>
            <EuiFormRow
              isInvalid={!formValidation.lastName}
              label="Last Name"
              fullWidth
            >
              <EuiFieldText
                name="lastName"
                value={lastName}
                onChange={this.onInputChange}
                fullWidth
              />
            </EuiFormRow>
          </EuiFlexItem>
        </EuiFlexGroup>
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
          fullWidth
          isInvalid={!formValidation.birthDate}
          label="Date of Birth"
        >
          <EuiDatePicker
            name="birthDate"
            dateFormat="YYYY-MM-DD"
            selected={birthDate}
            maxDate={moment().subtract(14, "years")}
            onChange={(ev) =>
              this.onInputChange({
                target: { name: "birthDate", value: ev },
              })
            }
            fullWidth
          />
        </EuiFormRow>
        <EuiFormRow
          label="Password"
          helpText={passwordHelpText}
          isInvalid={!formValidation.password}
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
              onChange={(ev) => {
                this.onInputChange(ev);
                this.setPasswordStrength(ev.target.value);
              }}
              isLoading={passwordStrength.checking}
              fullWidth
            />
          </EuiToolTip>
        </EuiFormRow>
        <EuiFormRow className="form-button" fullWidth>
          <EuiButton fill isLoading={loading} type="submit" fullWidth>
            <img src={rightArrow} alt="next" />
          </EuiButton>
        </EuiFormRow>
      </EuiForm>
    );
  }
}

export default RegisterForm;
