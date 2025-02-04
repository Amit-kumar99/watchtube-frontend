export interface ValidationErrors {
  fullName?: string;
  username?: string;
  email?: string;
  password?: string;
  avatar?: string;
}

const validateEmail = (email: string) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(email).toLowerCase()) ? "" : "Invalid email format.";
};

const validateRequired = (value: string, fieldName: string) => {
  return value?.trim() === "" ? `${fieldName} is required.` : "";
};

export const validateSignin = (username: string, password: string) => {
  const errors: ValidationErrors = {};
  const usernameRequiredError = validateRequired(username, "Username");
  if (usernameRequiredError !== "") {
    errors.username = usernameRequiredError;
  }
  const passwordRequiredError = validateRequired(password, "Password");
  if (passwordRequiredError !== "") {
    errors.password = passwordRequiredError;
  }
  return errors;
};

export const validateSignup = (
  fullName: string,
  username: string,
  email: string,
  password: string,
  avatar: string
) => {
  const errors: ValidationErrors = {};
  const fullNameRequiredError = validateRequired(fullName, "Fullname");
  if (fullNameRequiredError !== "") {
    errors.fullName = fullNameRequiredError;
  }
  const usernameRequiredError = validateRequired(username, "Username");
  if (usernameRequiredError !== "") {
    errors.username = usernameRequiredError;
  }
  const emailRequiredError = validateRequired(email, "Email");
  const invalidEmailFormat = validateEmail(email);
  if (emailRequiredError !== "") {
    errors.email = emailRequiredError;
  } else if (invalidEmailFormat !== "") {
    errors.email = invalidEmailFormat;
  }
  const passwordRequiredError = validateRequired(password, "Password");
  if (passwordRequiredError !== "") {
    errors.password = passwordRequiredError;
  }
  const avatarRequiredError = validateRequired(avatar, "Avatar");
  if (avatarRequiredError !== "") {
    errors.avatar = avatarRequiredError;
  }
  return errors;
};
