import * as Yup from 'yup';

export const signupValidationSchema = Yup.object().shape({
  firstName: Yup.string().required().min(3).label('First Name'),
  lastName: Yup.string().required().min(1).label('Last Name'),
  email: Yup.string().required().email().label('Email'),
  password: Yup.string().required().min(6).label('Password'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password')], 'Confirm Password must match password.')
    .required('Confirm Password is required.'),
});

export const loginValidationSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter a registered email')
    .email('Please enter a valid email')
    .label('Email'),

  password: Yup.string()
    .required('Please enter your password')
    .min(6)
    .label('Password'),
});

export const forgotPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .required('Please enter a registered email')
    .label('Email')
    .email('Enter a valid email'),
});

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required('Please enter new password')
    .min(6)
    .label('Password'),
});

export const newCustomerSchema = Yup.object().shape({
  name: Yup.string().required().min(3).label('Name'),
  email: Yup.string().required().email().label('Email'),
  contactNumber: Yup.string().min(5).required().label('ContactNumber'),
});

export const newEmployeeSchema = Yup.object().shape({
  name: Yup.string().required().min(3).label('Name'),
  email: Yup.string().required().email().label('Email'),
  contactNumber: Yup.string().min(5).required().label('ContactNumber'),
});

export const newCustomerApplicationSchema = Yup.object().shape({
  name: Yup.string().required().min(3).label('Name'),
  street: Yup.string().required().min(3).label('Street'),
  city: Yup.string().required().min(3).label('City'),
  state: Yup.string().required().min(3).label('State'),
  zipcode: Yup.string().required().min(3).label('Zipcode'),
  volume: Yup.number().required().label('Volume'),
});
