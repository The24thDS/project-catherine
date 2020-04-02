import React, { useState } from "react";
import PropTypes from "prop-types";
import {
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiTitle,
  EuiPage,
  EuiButton,
  EuiText
} from "@elastic/eui";

export default function ForgotPasswordForm({ closeModal }) {
  const [state, setState] = useState({
    user: "",
    loading: false,
    reset: false,
    formErrors: "",
    formMessage: ""
  });

  const submitForm = async event => {
    event.preventDefault();
    const serverUrl = process.env.REACT_APP_SERVER_URL;
    if (state.user.length > 0) {
      setState({
        ...state,
        loading: true
      });
      const response = await fetch(serverUrl + "/auth/reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          user: state.user
        })
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
          reset: true
        });
      } else {
        setState({
          ...state,
          loading: false,
          formErrors: "An account with this user/email doesn't exist"
        });
      }
    } else {
      setState({
        ...state,
        formErrors: "You must fill the input"
      });
    }
  };

  return (
    <EuiPage className="form-container modal">
      <span
        role="img"
        aria-label="Close forgot password window"
        className="close"
        onClick={closeModal}
      >
        ❌
      </span>
      {state.reset === false ? (
        <form onSubmit={submitForm}>
          <EuiForm
            isInvalid={state.formErrors.length > 0}
            error={state.formErrors}
          >
            <EuiTitle>
              <h2>Reset your password</h2>
            </EuiTitle>
            <EuiFormRow label="username or email">
              <EuiFieldText
                value={state.user}
                name="user"
                onChange={ev => setState({ ...state, user: ev.target.value })}
              />
            </EuiFormRow>
            <EuiFormRow className="form-button">
              <EuiButton isLoading={state.loading} type="submit">
                Reset
              </EuiButton>
            </EuiFormRow>
          </EuiForm>
        </form>
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
  closeModal: PropTypes.func.isRequired
};
