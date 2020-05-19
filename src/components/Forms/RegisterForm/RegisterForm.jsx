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

import "../forms.sass";

import {
  validatePassword,
  calculatePasswordStrength,
} from "../../../utils/password";
import rightArrow from "../../../assets/arrow-right.svg";
import ServerRequest from "../../../utils/ServerRequest";

class RegisterForm extends React.Component {
  constructor() {
    super();
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
      success: false,
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
      formErrors: [],
    }));
  };

  validateForm = async () => {
    const registerFormSchema = yup.object({
      firstName: yup.string().trim().required("First Name is a required field"),
      lastName: yup.string().trim().required("Last Name is a required field"),
      email: yup.string().trim().email().required(),
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
    const req = new ServerRequest(
      "/auth/register",
      "POST",
      { "Content-Type": "application/json" },
      this.state.formInputs
    );
    const response = await req.send();

    if (response.status === 201) {
      this.setState({
        loading: false,
        success: true,
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
      await this.register();
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
      success,
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

    return success ? (
      <EuiText
        style={{
          textAlign: "center",
          height: "calc(100% - 100px)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
          fontSize: "20px",
        }}
      >
        <h2>Account created</h2>
        <p>Check your inbox or spam folder for the activation email.</p>
      </EuiText>
    ) : (
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
