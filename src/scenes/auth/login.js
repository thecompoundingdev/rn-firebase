import React, { useCallback, useState } from 'react';
import {
  StyleSheet,
  View,
  TouchableWithoutFeedback,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, Input, Layout, Text, Icon } from '@ui-kitten/components';
import { useTranslation } from 'react-i18next';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Formik } from 'formik';
import { SafeAreaView } from 'react-native-safe-area-context';
import { openBrowserAsync } from 'expo-web-browser';

import { Logo } from '../../components';
import { auth } from '../../services/firebase-service';
import { screens } from '../../app/app-screens';
import { loginValidationSchema } from '../../utils/validations';

import {
  FacebookIcon,
  GoogleIcon,
  EmailIcon,
  TwitterIcon,
} from '../../utils/extra/icons';

import { KeyboardAvoidingView } from '../../utils/extra/3rd-party.js';

const initialValues = {
  email: '',
  password: '',
};

const openLinks = async () => {
  try {
    await openBrowserAsync('https://google.com');
  } catch {
    Alert.alert('Failed to open!');
  }
};

const LoginPage = () => {
  const navigation = useNavigation();
  const { t } = useTranslation();

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loadStatus, setLoadStatus] = useState(false);

  const onSignInButtonPress = async ({ email, password }) => {
    try {
      setLoadStatus(true);
      await signInWithEmailAndPassword(auth, email, password);
    } catch (ex) {
      Alert.alert(ex.message);
      setLoadStatus(false);
    }
  };

  const onSignUpButtonPress = () => {
    navigation.navigate(screens.SignUp);
  };

  const onForgotPasswordButtonPress = () => {
    navigation.navigate(screens.ForgotPassword);
  };

  const onPasswordIconPress = useCallback(() => {
    setPasswordVisible(prev => !prev);
  }, []);

  const renderPasswordIcon = props => (
    <TouchableWithoutFeedback onPress={onPasswordIconPress}>
      <Icon {...props} name={passwordVisible ? 'eye-off' : 'eye'} />
    </TouchableWithoutFeedback>
  );

  return (
    <KeyboardAvoidingView>
      <SafeAreaView style={styles.container}>
        <Layout style={styles.container}>
          <View style={styles.topNav}>
            <TouchableWithoutFeedback onPress={openLinks}>
              <Text>About us</Text>
            </TouchableWithoutFeedback>

            <Logo />

            <TouchableWithoutFeedback onPress={openLinks}>
              <Text>Call us</Text>
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.headerContainer}>
            <Text style={styles.signInLabel} category="h1" status="basic">
              {t('login.hello')}
            </Text>

            <Text style={styles.signInLabel} category="s1" status="basic">
              {t('login.signin-to-account')}
            </Text>
          </View>

          <Formik
            initialValues={initialValues}
            validationSchema={loginValidationSchema}
            onSubmit={onSignInButtonPress}
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
                    accessoryLeft={EmailIcon}
                    autoCapitalize="none"
                    caption={(touched.email && errors.email) || ''}
                    keyboardType="email-address"
                    name="email"
                    onBlur={handleBlur('email')}
                    onChangeText={handleChange('email')}
                    placeholder={t('login.email')}
                    size="large"
                    status="basic"
                    textContentType="emailAddress"
                    value={values.email}
                  />
                  <Input
                    accessoryRight={renderPasswordIcon}
                    caption={(touched.password && errors.password) || ''}
                    name="password"
                    onBlur={handleBlur('password')}
                    onChangeText={handleChange('password')}
                    placeholder={t('login.password')}
                    secureTextEntry={!passwordVisible}
                    size="large"
                    status="basic"
                    style={styles.passwordInput}
                    value={values.password}
                  />
                  <View style={styles.forgotPasswordContainer}>
                    <Button
                      appearance="ghost"
                      onPress={onForgotPasswordButtonPress}
                      status="basic"
                      style={styles.forgotPasswordButton}
                    >
                      {t('login.forgot-password')}
                    </Button>
                  </View>
                </View>

                <Button
                  disabled={loadStatus}
                  onPress={handleSubmit}
                  size="large"
                  style={styles.signInButton}
                >
                  {t('login.signin-upper')}
                </Button>
              </>
            )}
          </Formik>

          <View style={styles.socialAuthContainer}>
            <Text style={styles.socialAuthHintText} status="basic">
              {t('login.signin-social')}
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
            onPress={onSignUpButtonPress}
          >
            {t('login.no-account')}
          </Button>
        </Layout>

        <View style={styles.bottomNav}>
          <Text>Copyright &copy; {new Date().getFullYear()} CS Apps</Text>

          <TouchableWithoutFeedback onPress={openLinks}>
            <Text>Privacy Policy</Text>
          </TouchableWithoutFeedback>
        </View>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
};

export default LoginPage;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    minHeight: 180,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  topNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
    paddingHorizontal: 15,
  },
  bottomNav: {
    marginTop: 15,
    paddingHorizontal: 15,
  },
  formContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  signInLabel: {
    marginTop: 10,
  },
  passwordInput: {
    marginTop: 16,
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
    marginBottom: 50,
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
});
