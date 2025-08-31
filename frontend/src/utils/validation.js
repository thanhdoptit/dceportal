// Validation utilities cho form đăng nhập
export const validateUsername = (username) => {
  if (!username) {
    return 'Vui lòng nhập tên đăng nhập!';
  }
  if (username.length < 3) {
    return 'Tên đăng nhập phải có ít nhất 3 ký tự!';
  }
  return null;
};

export const validatePassword = (password) => {
  if (!password) {
    return 'Vui lòng nhập mật khẩu!';
  }
  if (password.length < 6) {
    return 'Mật khẩu phải có ít nhất 6 ký tự!';
  }
  return null;
};

export const validateLoginForm = (username, password) => {
  const usernameError = validateUsername(username);
  const passwordError = validatePassword(password);
  
  return {
    isValid: !usernameError && !passwordError,
    errors: {
      username: usernameError,
      password: passwordError
    }
  };
}; 