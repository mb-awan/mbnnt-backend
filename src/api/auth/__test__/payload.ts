export const register_with_correct_credentials = {
  username: 'john_doe',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@gmail.com',
  phone: '0123-456-7890',
  password: '12345Aa@',
  confirmPassword: '12345Aa@',
  role: 'student',
  currentAddress: {
    street: '123 Main St',
    city: 'Anytown',
    state: 'CA',
    zip: '12345',
  },
  postalAddress: {
    street: '456 Another St',
    city: 'Sometown',
    state: 'NY',
    zip: '67890',
  },
};

export const register_with_invalid_username = {
  ...register_with_correct_credentials,
  username: 'John Doe',
};

export const register_with_different_passwords = {
  ...register_with_correct_credentials,
  confirmPassword: '12345Aa!',
};

export const register_with_admin_role = {
  ...register_with_correct_credentials,
  role: 'admin',
};

export const register_with_non_existing_role = {
  ...register_with_correct_credentials,
  role: 'non-existing-role',
};

// login payload
export const login_with_correct_credentials = {
  username: 'john_doe',
  password: '12345Aa@',
};

export const login_with_wrong_credentials = {
  username: 'john_doe',
  password: '12345Aa!',
};

export const login_with_correct_credentials_but_different_email = {
  username: 'john_doe',
  password: '12345Aa@',
  email: 'student_user8@gmail.com',
};
