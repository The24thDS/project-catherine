import sha1 from "sha-1";

const serverUrl = process.env.REACT_APP_SERVER_URL;

const isEmailValid = email => {
  if (email.length === 0) {
    return false;
  }
  const regexp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
  let isValid = regexp.test(email);
  return isValid;
};

const isEmailAvailable = async email => {
  if (isEmailValid(email)) {
    const response = await fetch(`${serverUrl}/user/checkEmailAvailability`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        input: email
      })
    });
    const data = await response.json();
    return data.available;
  } else {
    return false;
  }
};

const isUsernameAvailable = async username => {
  let isValid =
    !username.startsWith(" ") && !username.endsWith(" ") && username.length;
  if (isValid) {
    const response = await fetch(
      `${serverUrl}/user/checkUsernameAvailability`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          input: username
        })
      }
    );
    const data = await response.json();
    isValid = data.available;
  }
  return isValid;
};

const validatePassword = ctx => async () => {
  const { password, email } = ctx.state;
  if (password.length === 0) {
    ctx.setState({
      passwordInvalid: true,
      passwordError: "Password can't be empty"
    });
  } else {
    ctx.setState({
      passwordInvalid: false,
      passwordError: ""
    });
  }
  if (ctx.props.type === "login") {
    return;
  }
  if (password.length < 10) {
    ctx.setState({
      passwordInvalid: true,
      passwordError: "Password is too short"
    });
  } else if (password === email) {
    ctx.setState({
      passwordInvalid: true,
      passwordError: "Password can't be your email"
    });
  } else {
    ctx.setState({
      passwordLoading: true
    });
    const hashedPass = sha1(password).toUpperCase();
    const prefix = hashedPass.slice(0, 5);
    const response = await fetch(
      `https://api.pwnedpasswords.com/range/${prefix}`
    );
    const data = await response.text();
    const hashes = data.split("\n").map(info => {
      const suffix = info.split(":")[0];
      return prefix + suffix;
    });
    if (hashes.includes(hashedPass)) {
      ctx.setState({
        passwordInvalid: true,
        passwordError: "Password exposed! Stop using this password!",
        passwordLoading: false
      });
    } else {
      ctx.setState({
        passwordInvalid: false,
        passwordError: "",
        passwordLoading: false
      });
    }
  }
};

const calculatePasswordStrength = password => {
  let score = 0;
  const digitsRegExp = new RegExp("([0-9])", "g");
  const lowercaseRegExp = new RegExp("([a-z])", "g");
  const uppercaseRegExp = new RegExp("([A-Z])", "g");
  const specialsRegExp = /([.,<>/?;:'"\\|\]}[{+\-*=_)(&^%$#@!`~])/g;
  const used = {
    lowercase: false,
    uppercase: false,
    digits: false,
    specials: false
  };
  if (password.length < 10) {
    return 0;
  }
  if (digitsRegExp.test(password)) {
    score += 10;
    used.digits = true;
  }
  if (lowercaseRegExp.test(password)) {
    score += 5;
    used.lowercase = true;
  }
  if (uppercaseRegExp.test(password)) {
    score += 5;
    used.uppercase = true;
  }
  if (specialsRegExp.test(password)) {
    score += 20;
    used.specials = true;
  }
  if (password.length > 20) {
    Object.values(used).forEach(type => {
      if (type === true) {
        score += 10;
      } else {
        score += 5;
      }
    });
  }
  if (password.length > 30) {
    Object.values(used).forEach(type => {
      if (type === true) {
        score += 5;
      } else {
        score += 2.5;
      }
    });
  }
  return score;
};

export {
  isEmailValid,
  isEmailAvailable,
  isUsernameAvailable,
  validatePassword,
  calculatePasswordStrength
};
