import sha1 from "sha-1";

const validatePassword = async (password) => {
  const hashedPass = sha1(password).toUpperCase();
  const prefix = hashedPass.slice(0, 5);
  const response = await fetch(
    `https://api.pwnedpasswords.com/range/${prefix}`
  );
  const data = await response.text();
  const hashes = data.split("\n").map((info) => {
    const suffix = info.split(":")[0];
    return prefix + suffix;
  });
  if (hashes.includes(hashedPass)) {
    return false;
  } else {
    return true;
  }
};

const calculatePasswordStrength = (password) => {
  let score = 0;
  const digitsRegExp = new RegExp("([0-9])", "g");
  const lowercaseRegExp = new RegExp("([a-z])", "g");
  const uppercaseRegExp = new RegExp("([A-Z])", "g");
  const specialsRegExp = /([.,<>/?;:'"\\|\]}[{+\-*=_)(&^%$#@!`~])/g;
  const used = {
    lowercase: false,
    uppercase: false,
    digits: false,
    specials: false,
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
    Object.values(used).forEach((type) => {
      if (type === true) {
        score += 10;
      } else {
        score += 5;
      }
    });
  }
  if (password.length > 30) {
    Object.values(used).forEach((type) => {
      if (type === true) {
        score += 5;
      } else {
        score += 2.5;
      }
    });
  }
  return score;
};

export { validatePassword, calculatePasswordStrength };
