import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import {
  Button,
  CheckBox,
  Input,
  Layout,
  // useStyleSheet,
  Text,
  Icon,
} from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { Formik } from 'formik';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { serverTimestamp } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Logo } from '../../components';
import { auth, userService } from '../../services/firebase-service';
import { signupValidationSchema } from '../../utils/validations';
import { screens } from '../../app/app-screens';
import {
  EmailIcon,
  FacebookIcon,
  GoogleIcon,
  PersonIcon,
  TwitterIcon,
} from '../../utils/extra/icons';
import { KeyboardAvoidingView } from '../../utils/extra/3rd-party.js';
import { SelectComp } from '../../components/select-component';

const initialValues = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirmPassword: '',
};

const roles = [
  { value: 'admin', label: 'Admin' },
  { value: 'manager', label: 'Manager' },
  { value: 'employee', label: 'Employee' },
  { value: 'customer', label: 'Customer' },
];

const defaultRole = roles[0].value;

const SignupPage = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();
  // const styles = useStyleSheet(themedStyles);
  const styles = themedStyles;

  const [loadStatus, setLoadStatus] = useState(false);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [selectedRole, setSelectedRole] = useState(defaultRole);

  const onSignInButtonPress = () => {
    navigation.navigate(screens.Login);
  };

  const onSignUpButtonPress = async values => {
    const { firstName, lastName, email, password } = values;

    try {
      setLoadStatus(true);
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      const payload = {
        firstName,
        lastName,
        email,
        role: selectedRole, // 'customer' should be here
        createdAt: serverTimestamp(),
      };
      await userService.addNewUser(cred.user.uid, payload);
    } catch (error) {
      Alert.alert(error.message);
      setLoadStatus(false);
    }
  };

  const onPasswordIconPress = useCallback(() => {
    setPasswordVisible(prev => !prev);
  }, []);

  const renderPasswordIcon = props => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  const renderCheckboxLabel = useCallback(
    evaProps => (
      <Text {...evaProps} style={styles.termsCheckBoxText}>
        {t('signup.agree-tnc')}
      </Text>
    ),
    []
  );

  const handleRoleChange = roleObj => {
    setSelectedRole(roleObj.value);
  };

  return (
    <KeyboardAvoidingView style={styles.container}>
      <SafeAreaView>
        <Layout style={styles.container}>
          <View style={styles.headerContainer}>
            <Logo large />

            <Text style={styles.signInLabel} category="s1" status="basic">
              {t('signup.create-account')}
            </Text>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={signupValidationSchema}
            onSubmit={onSignUpButtonPress}
          >
            {({
              values,
              touched,
              errors,
              handleChange,
              handleSubmit,
              handleBlur,
            }) => (
              <>
                <View style={styles.formContainer}>
                  <Input
                    accessoryLeft={PersonIcon}
                    caption={(touched.firstName && errors.firstName) || ''}
                    name="firstName"
                    onBlur={handleBlur('firstName')}
                    onChangeText={handleChange('firstName')}
                    placeholder={t('signup.first-name')}
                    size="large"
                    status="basic"
                    style={styles.firstNameInput}
                    value={values.firstName}
                  />

                  <Input
                    accessoryLeft={PersonIcon}
                    caption={(touched.lastName && errors.lastName) || ''}
                    name="lastName"
                    onBlur={handleBlur('lastName')}
                    onChangeText={handleChange('lastName')}
                    placeholder={t('signup.last-name')}
                    size="large"
                    status="basic"
                    style={styles.lastNameInput}
                    value={values.lastName}
                  />

                  <Input
                    accessoryLeft={EmailIcon}
                    autoCapitalize="none"
                    caption={(touched.email && errors.email) || ''}
                    name="email"
                    onBlur={handleBlur('email')}
                    onChangeText={handleChange('email')}
                    placeholder={t('signup.email')}
                    size="large"
                    status="basic"
                    style={styles.emailInput}
                    value={values.email}
                  />

                  <SelectComp onChange={handleRoleChange} options={roles} />

                  <Input
                    accessoryRight={renderPasswordIcon}
                    caption={(touched.password && errors.password) || ''}
                    name="password"
                    onBlur={handleBlur('password')}
                    onChangeText={handleChange('password')}
                    placeholder={t('signup.password')}
                    secureTextEntry={!passwordVisible}
                    size="large"
                    status="basic"
                    style={styles.passwordInput}
                    value={values.password}
                  />

                  <Input
                    accessoryRight={renderPasswordIcon}
                    caption={
                      (touched.confirmPassword && errors.confirmPassword) || ''
                    }
                    name="confirmPassword"
                    onBlur={handleBlur('confirmPassword')}
                    onChangeText={handleChange('confirmPassword')}
                    placeholder={t('signup.confirm-password')}
                    secureTextEntry={!passwordVisible}
                    size="large"
                    status="basic"
                    style={styles.confirmPasswordInput}
                    value={values.confirmPassword}
                  />

                  <CheckBox
                    style={styles.termsCheckBox}
                    checked={termsAccepted}
                    onChange={checked => setTermsAccepted(checked)}
                  >
                    {renderCheckboxLabel}
                  </CheckBox>
                </View>

                <Button
                  disabled={!termsAccepted || loadStatus}
                  onPress={handleSubmit}
                  size="large"
                  style={styles.signInButton}
                >
                  {t('signup.signup-upper')}
                </Button>
              </>
            )}
          </Formik>

          <View style={styles.socialAuthContainer}>
            <Text style={styles.socialAuthHintText} status="basic">
              {t('signup.signup-social')}
            </Text>
            <View style={styles.socialAuthButtonsContainer}>
              <Button
                appearance="ghost"
                status="basic"
                size="giant"
                accessoryLeft={GoogleIcon}
              />
              <Button
                appearance="ghost"
                status="basic"
                size="giant"
                accessoryLeft={FacebookIcon}
              />
              <Button
                appearance="ghost"
                status="basic"
                size="giant"
                accessoryLeft={TwitterIcon}
              />
            </View>
          </View>
          <Button
            style={styles.signUpButton}
            appearance="ghost"
            status="basic"
            onPress={onSignInButtonPress}
          >
            {t('signup.have-account')}
          </Button>
        </Layout>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default SignupPage;

const themedStyles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    // marginTop: 25,
    minHeight: 216,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  signInLabel: {
    marginTop: 16,
  },
  firstNameInput: {
    marginBottom: 16,
  },
  lastNameInput: {
    marginBottom: 16,
  },
  emailInput: {
    marginBottom: 16,
  },
  passwordInput: {
    marginBottom: 16,
  },
  confirmPasswordInput: {
    marginBottom: 16,
  },
  signInButton: {
    marginHorizontal: 16,
  },
  forgotPasswordContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  forgotPasswordButton: {
    paddingHorizontal: 0,
  },
  signUpButton: {
    marginVertical: 12,
  },
  socialAuthContainer: {
    marginTop: 32,
  },
  socialAuthButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  socialAuthHintText: {
    alignSelf: 'center',
    marginBottom: 16,
  },
  termsCheckBox: {
    marginTop: 8,
    marginBottom: 32,
  },
  termsCheckBoxText: {
    marginLeft: 10,
  },
});
