import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiTitle,
  EuiPage,
  EuiButton,
  EuiText,
} from "@elastic/eui";

export default function ForgotPasswordForm({ closeModal }) {
  const [state, setState] = useState({
    email: "",
    loading: false,
    reset: false,
    formErrors: "",
    formMessage: "",
  });

  const submitForm = async (event) => {
    event.preventDefault();
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    if (state.email.length > 0) {
      setState({
        ...state,
        loading: true,
      });
      const response = await fetch(serverUrl + "/auth/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: state.email,
        }),
      });
      const data = await response.json();
      if (data.success === true) {
        setState({
          ...state,
          formMessage: (
            <div>
              <h2>Success!</h2>
              <p>Check your email</p>
            </div>
          ),
          reset: true,
        });
      } else {
        setState({
          ...state,
          loading: false,
          formErrors: "An account with this user/email doesn't exist",
        });
      }
    } else {
      setState({
        ...state,
        formErrors: "You must fill the input",
      });
    }
  };

  return (
    <EuiPage
      className="modal"
      style={{ width: "80vw", justifyContent: "center", maxWidth: "450px" }}
    >
      <span
        role="img"
        aria-label="Close forgot password window"
        className="close"
        onClick={closeModal}
        style={{ cursor: "pointer" }}
      >
        ❌
      </span>
      {state.reset === false ? (
        <EuiForm
          isInvalid={state.formErrors.length > 0}
          error={state.formErrors}
          onSubmit={submitForm}
          component="form"
          className="landing-form"
        >
          <EuiTitle>
            <h2>Reset your password</h2>
          </EuiTitle>
          <EuiFormRow label="Email" fullWidth>
            <EuiFieldText
              value={state.email}
              name="email"
              type="email"
              onChange={(ev) => setState({ ...state, email: ev.target.value })}
              fullWidth
            />
          </EuiFormRow>
          <EuiFormRow className="form-button" fullWidth>
            <EuiButton fill isLoading={state.loading} type="submit" fullWidth>
              Reset
            </EuiButton>
          </EuiFormRow>
        </EuiForm>
      ) : (
        <EuiText className="form-message">
          {state.formMessage}
          <EuiButton onClick={closeModal}>OK</EuiButton>
        </EuiText>
      )}
    </EuiPage>
  );
}

ForgotPasswordForm.propTypes = {
  closeModal: PropTypes.func.isRequired,
};
