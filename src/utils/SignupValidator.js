const isEmail = (email) =>
  String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );

const signupValidator = ({ name, about, username, email, password }) => {
  const errors = {};

  if (!name?.trim()) {
    errors.name = "Name is required";
  }

  if (!about?.trim()) {
    errors.about = "About is required";
  }

  if (!username?.trim()) {
    errors.username = "Username is required";
  } else if (username.length < 3 || username.length > 15) {
    errors.username = "Username must be between 3 and 15 characters";
  } else if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    errors.username =
      "Username can only contain letters, numbers, and underscores";
  }

  if (!email?.trim()) {
    errors.email = "Email is required";
  } else if (!isEmail(email)) {
    errors.email = "Invalid email";
  }

  if (!password?.trim()) {
    errors.password = "Password is required";
  } else if (password.length < 6 || password.length > 13) {
    errors.password = "Password must be between 6 and 13 characters";
  } else if (!/[A-Z]/.test(password)) {
    errors.password = "Password must contain at least one uppercase letter";
  } else if (!/[a-z]/.test(password)) {
    errors.password = "Password must contain at least one lowercase letter";
  } else if (!/[0-9]/.test(password)) {
    errors.password = "Password must contain at least one number";
  } else if (!/[!@#$%^&*]/.test(password)) {
    errors.password = "Password must contain at least one special character";
  }

  return errors;
};

export default signupValidator;
